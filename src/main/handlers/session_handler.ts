import { spawn } from 'child_process';
import { ipcMain, app } from 'electron';
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
    const execPath = process.env.APPIMAGE;

    if (execPath) {
      spawn(execPath, {
        detached: true,
        stdio: 'ignore',
      }).unref();
      app.exit(0);
    } else {
      app.relaunch();
      app.exit(0);
    }
  });
};
