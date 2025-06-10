import { CameraDriver } from '../drivers/camera';

export class CameraService {
  static async status() {
    try {
      return await CameraDriver.status();
    } catch (error) {
      throw error;
    }
  }

  static async capture() {
    try {
      await CameraDriver.capture();
    } catch (error) {
      throw error;
    }
  }
}
