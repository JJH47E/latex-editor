import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import installExtension from 'electron-devtools-installer';
const ANGULAR_DEVTOOLS = 'ienfalfjdbdpebioblfackkekamfmbnh';

const [port, devTools, allowIntegration] = process.argv.slice(2);
const appUrl = `http://localhost:${port}/`;

const fs = require('fs');
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
  ipcMain.on('openWorkspace', async event => {
    var paths = (await openWorkspace()).filePaths;
    console.log(`file selected, path: ${paths.join(', ')}`);
    event.sender.send('openWorkspace-reply', paths);
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

  if (fs.existsSync(dir)) {
    throw Error(`directory: ${dir} already exists`);
  }

  fs.mkdirSync(dir, { recursive: true });

  console.log('created directory');

  // Create main.tex & .config (refer to notes)
}

async function openWorkspace() {
  return await dialog.showOpenDialog({properties: ['openFile']});
}
