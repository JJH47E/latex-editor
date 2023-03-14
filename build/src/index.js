const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const { copyFile, readdir, readFile, rm, writeFile } = require('node:fs/promises');
const { existsSync, mkdirSync, readFileSync, rmSync } = require('node:fs');
const AdmZip = require('adm-zip');
const path = require('node:path');
const COPYFILE_EXCL = require('node:constants');
const { exec } = require('node:child_process');

var mime = require('mime-types')
const workingDirectory = './.tmp/active';
const templateDirectory = './templates';
const binDirectory = './bin';
const workspaceFilters = [
  {
    name: 'TeXProject',
    extensions: ['texproj']
  }
];

const pdfFilters = [
  {
    name: 'PDF',
    extensions: ['pdf']
  }
];

let workspacePath = '';
var hasConfirmedClose = false;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      nodeIntegration: true
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('close', async (event) => {
    if (!hasConfirmedClose) {
      // stop window closing
      event.preventDefault();
      // Show dialog asking is the user wants to save their work
      const result = dialog.showMessageBoxSync({
          title: 'Confirm',
          message: 'Are you sure you want to exit? Any unsaved work will be lost',
          buttons: ['Save', 'Don\'t Save', 'Cancel']
      })
  
      if (result === 0) {
        // save
        if (!workspacePath) {
          // trigger save as flow
          var configContents = await getConfigContents(workingDirectory)
          var savePath = await openSavePrompt(configContents.name, workspaceFilters)
          if (!savePath) {
            console.log('Save aborted');
            return;
          }
          await saveWorkspace(workspacePath, savePath);
        } else {
          // save like normal
          await saveWorkspace(workspacePath);
        }
        hasConfirmedClose = true;
        mainWindow.close();
      } else if (result === 1) {
        hasConfirmedClose = true;
        mainWindow.close();
      } if (result === 2) {
        // Do not close
        return;
      }
    }
});
}

app.whenReady().then(async () => {
  console.log('setting up handlers');
  ipcMain.on('createWorkspace', async (event, workspaceName, template) => {
    await createWorkspace(workspaceName, template);
    event.sender.send('loadWorkspace-reply', await getConfigContents(workingDirectory));
  });
  ipcMain.on('selectWorkspace', async event => {
    var paths = (await selectWorkspace()).filePaths;
    if (paths.length > 1) {
      throw Error('Prompt should not be multi-select');
    } else if (paths.length == 0) {
      console.log('no file selected, returning');
      return;
    }
    console.log(`file selected, path: ${paths[0]}`);
    workspacePath = paths[0];
    event.sender.send('selectWorkspace-reply', paths[0]);
  });
  ipcMain.on('loadWorkspace', async (event, relativePath) => {
    console.log(`loading workspace: ${relativePath}`)
    var workingPath = await loadWorkspace(relativePath);
    console.log(`ABSOLUTE PATH: ${workingPath}`);
    event.sender.send('loadWorkspace-reply', await getConfigContents(workingPath));
  });
  ipcMain.on('getFile', async (event, path) => {
    console.log(`loading file: ${path}`);
    let fileBlob = await getFileContents(path);
    console.log(`loaded file: ${path}, returning to renderer process`);
    event.returnValue = fileBlob;
  });
  ipcMain.on('saveFileAsync', async (event, fileToSave, newFileToLoad) => {
    console.log(`recieved request to save file: ${fileToSave.path}`);
    await writeFileToDisk(fileToSave);
    event.sender.send('saveFileAsync-reply', newFileToLoad);
  });
  ipcMain.on('saveFile', async (event, fileToSave, newFileToLoad) => {
    console.log(`recieved request to save file: ${fileToSave.path}`);
    await writeFileToDisk(fileToSave);
    event.returnValue = newFileToLoad;
  });
  ipcMain.on('saveWorkspace', async (event) => {
    console.log(`recieved request to save workspace. current loaded directory: ${workspacePath}`);
    if (workspacePath) {
      await saveWorkspace(workspacePath);
    } else {
      let configContents = await getConfigContents(workingDirectory);
      let savePath = await openSavePrompt(configContents.name, workspaceFilters);
      if (!savePath) {
        console.log('Save aborted');
        return;
      }
      console.log(`saving to: ${savePath}`);
      await saveWorkspace(workspacePath, savePath);
    }
    event.sender.send('saveWorkspace-reply', true);
  });
  ipcMain.on('saveWorkspaceAs', async (event) => {
    let configContents = await getConfigContents(workingDirectory);
    let savePath = await openSavePrompt(configContents.name, workspaceFilters);
    if (!savePath) {
      console.log('Save aborted');
      return;
    }
    console.log(`saving to: ${savePath}`);
    await saveWorkspace(workspacePath, savePath);
    event.sender.send('saveWorkspace-reply', true);
  });
  ipcMain.on('generatePreview', async (event) => {
    // compile doc
    await generatePreview(event);
  });
  ipcMain.on('downloadPdf', async (event) => {
    await generatePreview(event);
    let configContents = await getConfigContents(workingDirectory);
    let savePath = await openSavePrompt(configContents.name, pdfFilters);
    if (!savePath) {
      console.log('Save aborted');
      return;
    }
    console.log(`saving to: ${savePath}`);
    await saveFile((await getFileContents('main.pdf')).data, savePath);
  });
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

async function createWorkspace(name, template) {
  // fixes bug when new workspace is created after existing one is loaded in, probably a better place to put this
  workspacePath = '';
  await refreshWorkingDirectory();

  console.log(`creating workspace, ${name}, directory: ${workingDirectory}`);

  // create .config & save to working directory & copy main.tex from template
  const files = await copyTemplate(template);
  const workspaceConfig = {name, filePaths: files};
  await writeFile(`${workingDirectory}/.config`, JSON.stringify(workspaceConfig));
}

async function copyTemplate(template) {
  // get list of files present in template directory
  // copy each individual file
  const templateDir = `${templateDirectory}/${template}/`;
  const files = await readdir(templateDir);

  for (const file of files) {
    console.log(`found file: ${file}`);
    await copyFile(`${templateDir}${file}`, `${workingDirectory}/${file}`);
  }

  return files;
}

async function selectWorkspace() {
  return await dialog.showOpenDialog({filters: workspaceFilters, properties: ['openFile']});
}

async function refreshWorkingDirectory() {
  if (existsSync(workingDirectory)) {
    await rm(workingDirectory, { recursive: true, force: true });
  }

  await mkdirSync(workingDirectory, { recursive: true });
}

async function loadWorkspace(relativePath) {
  if (!relativePath) {
    throw Error(`Invalid path: ${relativePath}`);
  }

  var zip = new AdmZip(relativePath);
  await refreshWorkingDirectory();
  zip.extractAllTo(workingDirectory, true);
  return path.resolve(workingDirectory);
}

async function getConfigContents(path) {
  try {
    const data = await readFile(`${path}/.config`, { encoding: 'utf8' });
    return JSON.parse(data);
  } catch(err) {
    console.log(err);
    return {};
  }
}

async function getFileContents(relativePath) {
  try {
    const filePath = path.resolve(`${workingDirectory}/${relativePath}`)
    const data = await readFile(filePath, { encoding: 'base64' });
    return {path: relativePath, data: Buffer.from(data, 'base64'), contentType: mime.contentType(filePath) || 'application/octet-stream'};
  } catch(err) {
    console.log(err);
    return {};
  }
}

function getFileContentsSync(relativePath) {
  try {
    const filePath = path.resolve(`${workingDirectory}/${relativePath}`)
    const data = readFileSync(filePath, { encoding: 'base64' });
    return {path: relativePath, data: Buffer.from(data, 'base64'), contentType: mime.contentType(filePath)};
  } catch(err) {
    console.log(err);
    return {};
  }
}

async function writeFileToDisk(fileToSave) {
  var pathToWrite = path.resolve(`${workingDirectory}/${fileToSave.path}`);
  await writeFile(pathToWrite, Buffer.from(fileToSave.data), { encoding: 'base64' });
}

async function saveWorkspace(workspacePath, destinationPath = '') {
  var zip = new AdmZip();

  // add config to zip
  let worksapceConfig = await readFile(`${workingDirectory}/.config`, 'utf-8');
  const _workspaceConfig = JSON.parse(worksapceConfig);
  var configBuffer = Buffer.from(worksapceConfig);
  zip.addFile('.config', configBuffer)

  for (var path of _workspaceConfig.filePaths) {
    console.log(`Adding ${path}`);
    var buffer = Buffer.from(await readFile(`${workingDirectory}/${path}`, { encoding: 'base64'}), 'base64');
    zip.addFile(path, buffer);
  }

  await zip.writeZipPromise(!!destinationPath ? destinationPath : workspacePath);
}

async function saveFile(buffer, destinationPath) {
  return await writeFile(destinationPath, buffer);
}

async function openSavePrompt(fileName, fileFilters) {
  var saveResult = await dialog.showSaveDialog({title: fileName, filters: fileFilters});
  if (!!saveResult.filePath) {
    return saveResult.filePath;
  } else {
    return '';
  }
}

function doesFileExist(filePath) {
  return existsSync(filePath);
}

async function generatePreview(event) {
	if (!doesFileExist(`${workingDirectory}/main.tex`)) {
		console.log('Unable to find main.tex in given directory, exiting...');
		event.sender.send('generatePreview-error', 'main.tex not found');
    return;
	}
	console.log('Starting generate preview process');
  exec(path.resolve(`${binDirectory}/pdflatex.bat ${path.resolve(workingDirectory)}`), {windowsHide: true}, (error, _, stderr) => {
    if (error || stderr) {
      console.log('error, returning');
      const errorRegex = /^! LaTeX Error: /g;
      const fallbackErrorRegex = /l\.[0-9]+\ .+/g;
      try {
        var lines = readFileSync(`${workingDirectory}/main.log`).toString().split("\n")
        
        var errorLines = lines.filter(line => errorRegex.test(line));
        if (errorLines.length == 0) {
          errorLines = lines.filter(line => fallbackErrorRegex.test(line));
        }
        event.sender.send('generatePreview-error', errorLines);
        return;
      } catch {
        event.sender.send('generatePreview-error', ['An unknown error occurred, check application logs for more info']);
      }
    }

    console.log('Finished successfully');
    if (existsSync(`${workingDirectory}/main.log`)) {
      rmSync(`${workingDirectory}/main.log`, { force: true });
    }

    if (existsSync(`${workingDirectory}/main.aux`)) {
      rmSync(`${workingDirectory}/main.aux`, { force: true });
    }

    let fileBlob = getFileContentsSync('main.pdf');
    console.log('file contents read successfuly, returning');
    event.sender.send('generatePreview-reply', fileBlob);
    return;
  });
}
