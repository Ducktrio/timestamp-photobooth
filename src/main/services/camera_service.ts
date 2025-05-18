import { CameraDriver } from 'main/drivers/camera';

export class CameraService {
  static async status() {
    try {
      return await CameraDriver.status();
    } catch (error) {
      throw error;
    }
  }

  static async capture() {}
}
