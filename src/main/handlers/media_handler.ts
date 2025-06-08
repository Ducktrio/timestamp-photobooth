import { ipcMain } from 'electron';
import { Media } from '../services/media_service';

export const registerMediaHandler = () => {
  ipcMain.on('media/motion', async (event, url: string) => {
    try {
      console.log('[Media] receive data');
      Media.saveMotion(url);
    } catch (error) {
      throw error;
    }
  });

  console.log('Handlers for media is registered');
};
