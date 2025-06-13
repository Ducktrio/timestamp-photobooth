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

    const options: any = {};
    if (process.env.APPIMAGE) {
      options.execPath = process.env.APPIMAGE;
      options.args.unshift('--appimage-extract-and-run');
    }

    app.relaunch(options);
    app.exit(0);
  });
};
