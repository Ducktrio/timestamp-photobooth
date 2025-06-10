import { ipcMain } from 'electron';
import { File } from '../services/file_service';

export const registerFileHandlers = () => {
  ipcMain.handle('file/getCaptures', async () => {
    try {
      return await File.getCaptures();
    } catch (error) {
      throw error;
    }
  });
};
