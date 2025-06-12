/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import * as dotenv from 'dotenv';
import * as os from 'os';
import { existsSync } from 'fs';

// Env vars loader
function loadEnv() {
  const fallbackPaths = [
    path.join(os.homedir(), '.timestamp.env'),
    '/opt/timestamp/.env',
    path.join(__dirname, '.env'), // fallback if bundled inside AppImage
  ];

  for (const envPath of fallbackPaths) {
    if (existsSync(envPath)) {
      dotenv.config({ path: envPath });
      console.log(`✅ Loaded .env from: ${envPath}`);
      return;
    }
  }

  console.warn('⚠️ No .env file found in expected locations.');
}

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

loadEnv();

import { ViewfinderService } from './services/viewfinder_service';
import { registerCameraHandler } from './handlers/camera_handler';
import { registerMediaHandler } from './handlers/media_handler';
import { registerSessionHandlers } from './handlers/session_handler';
import { registerFileHandlers } from './handlers/file_handler';

registerCameraHandler();
registerMediaHandler();
registerSessionHandlers();
registerFileHandlers();

import { registerLoggingHandlers } from './handlers/logging_handler';
registerLoggingHandlers();

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
  console.log(app.getPath('userData'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    fullscreen: true,

    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      webSecurity: false,
      sandbox: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));
  mainWindow.setFullScreen(true);
  // Run viewfinder instance immediately
  // Opens web socket
  ViewfinderService(mainWindow!);

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.setKiosk(true);
    mainWindow.maximize();
  });
  mainWindow.webContents.addListener('will-redirect', (ev) => {
    ev.preventDefault();
  });

  mainWindow.webContents.addListener('will-navigate', (ev) => {
    ev.preventDefault();
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096');

app
  .whenReady()
  .then(() => {
    if (!process.env.BOOTH_TOKEN) {
      console.error('❌ BOOTH_TOKEN is not set in .env!');
      app.quit();
      return;
    }

    createWindow();

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
