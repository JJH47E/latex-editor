import { app, BrowserWindow, ipcMain, shell, dialog, FileFilter } from 'electron';
import { copyFile, readFile, rm, writeFile } from 'node:fs/promises';
import installExtension from 'electron-devtools-installer';
import { existsSync, mkdirSync } from 'node:fs';
import { WorkspaceConfig } from './workspace-config';
import * as AdmZip from 'adm-zip';
import path = require('node:path');
import { FileBlob, FileBlobRx } from './file-blob';
import { COPYFILE_EXCL } from 'node:constants';

var mime = require('mime-types')
const ANGULAR_DEVTOOLS = 'ienfalfjdbdpebioblfackkekamfmbnh';
const [port, devTools, allowIntegration] = process.argv.slice(2);
const appUrl = `http://localhost:${port}/`;
const workingDirectory = './.tmp/active';
const templateDirectory = './templates';
const fileFilters = [
  {
    name: 'TeXProject',
    extensions: ['texproj']
  } as FileFilter
];

let workspacePath = '';

function createWindow() {
  const options: Electron.BrowserWindowConstructorOptions = {
    width: 800,
    height: 600,
    show: false
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
  ipcMain.on('createWorkspace', async (event, workspaceName) => {
    await createWorkspace(workspaceName, 'test_template.tex');
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
  ipcMain.on('saveFile', async (event: any, fileToSave: FileBlobRx, newFileToLoad: string) => {
    console.log(`recieved request to save file: ${fileToSave.path}`);
    await writeFileToDisk(fileToSave);
    event.sender.send('saveFile-reply', newFileToLoad);
  });
  ipcMain.on('saveWorkspace', async (event) => {
    saveWorkspace(workspacePath);
    event.sender.send('saveWorkspace-reply', true);
  });
  ipcMain.on('saveWorkspaceAs', async (event) => {
    let configContents = await getConfigContents(workingDirectory);
    let savePath = await openSavePrompt(configContents.name);
    if (!savePath) {
      console.log('Save aborted');
      return;
    }
    console.log(`saving to: ${savePath}`);
    saveWorkspace(workspacePath, savePath);
    event.sender.send('saveWorkspace-reply', true);
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
  refreshWorkingDirectory();

  console.log(`creating workspace, ${name}, directory: ${workingDirectory}`);

  // create .config & save to working directory & copy main.tex from template
  const workspaceConfig = {name, filePaths: ['main.tex']} as WorkspaceConfig;
  await Promise.all([await writeFile(`${workingDirectory}/.config`, JSON.stringify(workspaceConfig)), await copyTemplate(template, 'main.tex')]);
}

async function copyTemplate(template: string, destFileName: string) {
  await copyFile(`${templateDirectory}/${template}`, `${workingDirectory}/${destFileName}`, COPYFILE_EXCL)
}

async function selectWorkspace() {
  return await dialog.showOpenDialog({filters: fileFilters, properties: ['openFile']});
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
  zip.extractAllTo(workingDirectory, false);
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

  _workspaceConfig.filePaths.forEach(async path => {
    var buffer = Buffer.from(await readFile(`${workingDirectory}/${path}`, 'utf-8'));
    zip.addFile(path, buffer)
  });

  await zip.writeZipPromise(!!destinationPath ? destinationPath : workspacePath);
}

async function openSavePrompt(title: string): Promise<string> {
  var saveResult = await dialog.showSaveDialog({title, filters: fileFilters});
  if (!!saveResult.filePath) {
    return saveResult.filePath;
  } else {
    return '';
  }
}
