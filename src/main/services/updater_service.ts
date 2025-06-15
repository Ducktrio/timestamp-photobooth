// src/services/AppUpdater.ts
import { autoUpdater } from 'electron-updater';
import { BrowserWindow } from 'electron';
import log from 'electron-log';

export default class AppUpdater {
  private window: BrowserWindow | null = null;

  constructor(mainWindow: BrowserWindow) {
    this.window = mainWindow;

    log.transports.file.level = 'info';
    autoUpdater.logger = log;

    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = false;

    this.registerEvents();

    // Always check on start
    autoUpdater.checkForUpdatesAndNotify().catch((err) => {
      this.sendStatus('error', err?.message ?? 'Unknown error');
    });
  }

  private sendStatus(status: string, payload?: any) {
    this.window?.webContents.send('update-status', status, payload);
  }

  private registerEvents() {
    autoUpdater.on('checking-for-update', () => {
      this.sendStatus('checking');
    });

    autoUpdater.on('update-available', () => {
      this.sendStatus('downloading');
    });

    autoUpdater.on('update-not-available', () => {
      this.sendStatus('not-available');
    });

    autoUpdater.on('download-progress', (progress) => {
      this.sendStatus('downloading', progress);
    });

    autoUpdater.on('update-downloaded', () => {
      this.sendStatus('ready');
      autoUpdater.quitAndInstall(false, true); // Silent + force restart
    });

    autoUpdater.on('error', (err) => {
      this.sendStatus('error', err?.message ?? 'Update failed');
    });
  }
}
