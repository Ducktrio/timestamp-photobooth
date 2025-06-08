import { increment } from '../stores/slices/motionSlice';
import { store } from '../stores/store';
import { writeFileSync } from '../utilities/filesystem.sync';
import path from 'path';
import { File } from './file_service';
import { writeFile } from '../utilities/filesystem';

class MediaService {
  /**
   * @param {string} url - url representation of binary data
   */
  public encoder(url: string) {
    const data = url.replace(/^data:image\/jpeg;base64,/, '');
    return Buffer.from(data, 'base64');
  }

  public saveCanvas(url: string) {
    const data = this.encoder(url);
  }

  /**
   * Save single motion frame
   * @param {string} url - url representation of the image blob
   */
  public saveMotion(url: string) {
    const data = this.encoder(url);
    try {
      const filepath = path.join(
        File.motionDir(),
        `motion_${store.getState().motion.index}.jpg`
      );
      writeFile(filepath, data);
      store.dispatch(increment());
    } catch (error) {
      throw error;
    }
  }
}

export const Media = new MediaService();
