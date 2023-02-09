import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import { readFile, rmdir } from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';
import installExtension from 'electron-devtools-installer';
import { existsSync, mkdirSync } from 'node:fs';
import { WorkspaceConfig } from './workspace-config';
import * as AdmZip from 'adm-zip';
import path = require('node:path');
const ANGULAR_DEVTOOLS = 'ienfalfjdbdpebioblfackkekamfmbnh';

const [port, devTools, allowIntegration] = process.argv.slice(2);
const appUrl = `http://localhost:${port}/`;
const workingDirectory = './.tmp/active';

const id = uuidv4();

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
  ipcMain.on('createWorkspace', (_, workspaceName) => {
    createWorkspace(workspaceName);
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
    event.sender.send('selectWorkspace-reply', paths[0]);
  });
  ipcMain.on('loadWorkspace', async (event, relativePath) => {
    console.log(`loading workspace: ${relativePath}`)
    var workingPath = await loadWorkspace(relativePath);
    console.log(`ABSOLUTE PATH: ${workingPath}`);
    event.sender.send('loadWorkspace-reply', await getConfigContents(workingPath));
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

function createWorkspace(name: string) {
  const dir = '.tmp/' + id;
  console.log(`creating workspace, ${name}, id: ${id}, directory: ${dir}`);

  if (existsSync(dir)) {
    throw Error(`directory: ${dir} already exists`);
  }

  mkdirSync(dir, { recursive: true });

  console.log('created directory');

  // Create main.tex & .config (refer to notes)
}

async function selectWorkspace() {
  return await dialog.showOpenDialog({properties: ['openFile']});
}

async function refreshWorkingDirectory() {
  if (existsSync(workingDirectory)) {
    await rmdir(workingDirectory, { recursive: true });
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
    const data = await readFile(`${path}/.config`, { encoding: 'utf8' });//! should be okay
    return JSON.parse(data) as WorkspaceConfig;
  } catch(err) {
    console.log(err);
    return {} as WorkspaceConfig;
  }
}
