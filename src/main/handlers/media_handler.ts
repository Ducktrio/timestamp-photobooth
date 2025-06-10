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

  ipcMain.handle('media/render', async () => {
    try {
      await Media.renderVideo();
    } catch (error) {
      throw error;
    }
  });

  ipcMain.on('media/canvas', (event, url: string) => {
    try {
      Media.saveCanvas(url);
    } catch (error) {
      throw error;
    }
  });

  ipcMain.handle(
    'media/print',
    async (event, url: string, quantity: number, split: boolean) => {
      try {
        await Media.savePrint(url);
        Media.print(quantity, split);
      } catch (error) {
        throw error;
      }
    }
  );

  console.log('Handlers for media is registered');
};
