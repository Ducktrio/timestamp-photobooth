import { execFile } from 'child_process';
import { ipcMain, app, RelaunchOptions } from 'electron';
import { CameraDriver } from '../drivers/camera';
import { File } from '../services/file_service';

export const registerSessionHandlers = () => {
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

    const options: RelaunchOptions = {
      execPath: process.execPath,
      args: process.argv.slice(1).concat(['--relaunch']),
    };
    if (process.env.APPIMAGE && app.isPackaged) {
      execFile(process.env.APPIMAGE, options.args);
      app.quit();
      return;
    }

    app.relaunch(options);
    app.quit();
  });
};
