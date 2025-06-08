import { ipcMain } from 'electron/main';
import { CameraDriver } from '../drivers/camera';
import { File } from '../services/file_service';

export const registerSessionHandlers = () => {
  ipcMain.handle('session/begin', async () => {
    try {
      CameraDriver.reset_index();
      await File.scanFolders();
      await File.cleanWorkspace();
    } catch (error) {
      throw error;
    }
  });
};
