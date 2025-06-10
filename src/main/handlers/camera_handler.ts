import { ipcMain } from 'electron';
import { CameraService } from '../services/camera_service';

export const registerCameraHandler = () => {
  ipcMain.handle('camera/status', async () => {
    try {
      return await CameraService.status();
    } catch (error) {
      throw error;
    }
  });
  ipcMain.handle('camera/capture', async () => {
    try {
      await CameraService.capture();
    } catch (error) {
      throw error;
    }
  });
  console.log('Handlers for camera is registered');
};
