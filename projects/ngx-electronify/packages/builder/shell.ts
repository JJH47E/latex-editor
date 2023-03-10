import { app, BrowserWindow, ipcMain, shell, dialog, FileFilter } from 'electron';
import { copyFile, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import installExtension from 'electron-devtools-installer';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { WorkspaceConfig } from './workspace-config';
import * as AdmZip from 'adm-zip';
import path = require('node:path');
import { FileBlob, FileBlobRx } from './file-blob';
import { COPYFILE_EXCL } from 'node:constants';
import { exec } from 'node:child_process';

var mime = require('mime-types')
const ANGULAR_DEVTOOLS = 'ienfalfjdbdpebioblfackkekamfmbnh';
const [port, devTools, allowIntegration] = process.argv.slice(2);
const appUrl = `http://localhost:${port}/`;
const workingDirectory = './.tmp/active';
const templateDirectory = './templates';
const binDirectory = './bin';
const workspaceFilters = [
  {
    name: 'TeXProject',
    extensions: ['texproj']
  } as FileFilter
];

const pdfFilters = [
  {
    name: 'PDF',
    extensions: ['pdf']
  } as FileFilter
];

let workspacePath = '';
var hasConfirmedClose = false;

function createWindow() {
  const options: Electron.BrowserWindowConstructorOptions = {
    width: 800,
    height: 600,
    show: false,
    autoHideMenuBar: true
  };

  // expose the Electron API into the global window object
  if (getBoolean(allowIntegration)) {
    options.webPreferences = {
      contextIsolation: false,
      nodeIntegration: true
    };
  }

  const mainWindow = new BrowserWindow(options);

  // load the URL of the Angular Live Development Server
  mainWindow.loadURL(appUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (getBoolean(devTools)) {
      mainWindow.webContents.openDevTools();
    }
  });

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

async function installAngularDevtools() {
  try {
    const name = await installExtension(ANGULAR_DEVTOOLS);
    console.log(`Added Extension:  ${name}`);
  } catch (err) {
    console.log('An error occurred when downloading the extension: ', err);
  }
}

app.whenReady().then(async () => {
  await installAngularDevtools();
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
  ipcMain.on('getFile', async (event:any, path: string) => {
    console.log(`loading file: ${path}`);
    let fileBlob = await getFileContents(path);
    console.log(`loaded file: ${path}, returning to renderer process`);
    event.returnValue = fileBlob;
  });
  ipcMain.on('saveFileAsync', async (event: any, fileToSave: FileBlobRx, newFileToLoad: string) => {
    console.log(`recieved request to save file: ${fileToSave.path}`);
    await writeFileToDisk(fileToSave);
    event.sender.send('saveFileAsync-reply', newFileToLoad);
  });
  ipcMain.on('saveFile', async (event: any, fileToSave: FileBlobRx, newFileToLoad: string) => {
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

app.on('web-contents-created', (_, contents) => {
  // Angular router is ignored on `will-navigate` event
  contents.on('will-navigate', (event, url) => {
    // allow hot reload to work properly
    if (url !== appUrl) {
      event.preventDefault();
    }
  });

  contents.setWindowOpenHandler(({ url }) => {
    // open all blank href links using the OS default browser
    setImmediate(() => {
      shell.openExternal(url);
    });
    return { action: 'deny' };
  });
});

function getBoolean(value: string) {
  return value === 'true' ? true : false;
}

async function createWorkspace(name: string, template: string) {
  // fixes bug when new workspace is created after existing one is loaded in, probably a better place to put this
  workspacePath = '';
  await refreshWorkingDirectory();

  console.log(`creating workspace, ${name}, directory: ${workingDirectory}`);

  // create .config & save to working directory & copy main.tex from template
  const files = await copyTemplate(template);
  const workspaceConfig = {name, filePaths: files} as WorkspaceConfig;
  await writeFile(`${workingDirectory}/.config`, JSON.stringify(workspaceConfig));
}

async function copyTemplate(template: string): Promise<string[]> {
  // get list of files present in template directory
  // copy each individual file
  const templateDir = `${templateDirectory}/${template}/`;
  const files = await readdir(templateDir);

  for (const file of files) {
    console.log(`found file: ${file}`);
    await copyFile(`${templateDir}${file}`, `${workingDirectory}/${file}`, COPYFILE_EXCL);
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

async function loadWorkspace(relativePath: string): Promise<string> {
  if (!relativePath) {
    throw Error(`Invalid path: ${relativePath}`);
  }

  var zip = new AdmZip(relativePath);
  await refreshWorkingDirectory();
  zip.extractAllTo(workingDirectory, true);
  return path.resolve(workingDirectory);
}

async function getConfigContents(path: string): Promise<WorkspaceConfig> {
  try {
    const data = await readFile(`${path}/.config`, { encoding: 'utf8' });
    return JSON.parse(data) as WorkspaceConfig;
  } catch(err) {
    console.log(err);
    return {} as WorkspaceConfig;
  }
}

async function getFileContents(relativePath: string): Promise<FileBlob> {
  try {
    const filePath = path.resolve(`${workingDirectory}/${relativePath}`)
    const data = await readFile(filePath, { encoding: 'base64' });
    return {path: relativePath, data: Buffer.from(data, 'base64'), contentType: mime.contentType(filePath) || 'application/octet-stream'} as FileBlob;
  } catch(err) {
    console.log(err);
    return {} as FileBlob;
  }
}

function getFileContentsSync(relativePath: string): FileBlob {
  try {
    const filePath = path.resolve(`${workingDirectory}/${relativePath}`)
    const data = readFileSync(filePath, { encoding: 'base64' });
    return {path: relativePath, data: Buffer.from(data, 'base64'), contentType: mime.contentType(filePath)} as FileBlob;
  } catch(err) {
    console.log(err);
    return {} as FileBlob;
  }
}

async function writeFileToDisk(fileToSave: FileBlobRx): Promise<void> {
  var pathToWrite = path.resolve(`${workingDirectory}/${fileToSave.path}`);
  await writeFile(pathToWrite, Buffer.from(fileToSave.data), { encoding: 'base64' });
}

async function saveWorkspace(workspacePath: string, destinationPath: string = ''): Promise<void> {
  var zip = new AdmZip();

  // add config to zip
  let worksapceConfig = await readFile(`${workingDirectory}/.config`, 'utf-8');
  const _workspaceConfig = JSON.parse(worksapceConfig) as WorkspaceConfig;
  var configBuffer = Buffer.from(worksapceConfig);
  zip.addFile('.config', configBuffer)

  for (var path of _workspaceConfig.filePaths) {
    console.log(`Adding ${path}`);
    var buffer = Buffer.from(await readFile(`${workingDirectory}/${path}`, { encoding: 'base64'}), 'base64');
    zip.addFile(path, buffer);
  }

  await zip.writeZipPromise(!!destinationPath ? destinationPath : workspacePath);
}

async function saveFile(buffer: Buffer, destinationPath: string) {
  return await writeFile(destinationPath, buffer);
}

async function openSavePrompt(fileName: string, fileFilters: FileFilter[]): Promise<string> {
  var saveResult = await dialog.showSaveDialog({title: fileName, filters: fileFilters});
  if (!!saveResult.filePath) {
    return saveResult.filePath;
  } else {
    return '';
  }
}

function doesFileExist(filePath: string): boolean {
  return existsSync(filePath);
}

async function generatePreview(event: Electron.IpcMainEvent): Promise<void> {
	if (!doesFileExist(`${workingDirectory}/main.tex`)) {
		console.log('Unable to find main.tex in given directory, exiting...');
		event.sender.send('generatePreview-error', 'main.tex not found');
    return;
	}
	console.log('Starting generate preview process');
  exec(path.resolve(`${binDirectory}/pdflatex.bat ${path.resolve(workingDirectory)}`), (error: Error, _: string, stderr: string) => {
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
