import { spawn } from 'child_process';
import { ipcMain, app, BrowserWindow } from 'electron';
import { CameraDriver } from '../drivers/camera';
import { File } from '../services/file_service';

export const registerSessionHandlers = (mainWindow: BrowserWindow) => {
  ipcMain.handle('session/begin', async () => {
    try {
      CameraDriver.reset_index();
      await File.scanFolders();
    } catch (error) {
      throw error;
    }
  });

  ipcMain.handle('session/end', async () => {
    try {
      await File.cleanWorkspace();
    } catch (error) {
      throw error;
    }

    mainWindow.webContents.send('reboot');
  });
};
