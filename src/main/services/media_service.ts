import { increment } from '../stores/slices/motionSlice';
import { store } from '../stores/store';
import path from 'path';
import { File } from './file_service';
import { writeFile } from '../utilities/filesystem';
import { spawn } from 'child_process';
import { once } from 'events';
import { Worker } from 'worker_threads';

class MediaService {
  /**
   * @param {string} url - url representation of binary data
   */
  public encoder(url: string) {
    const data = url.replace(/^data:image\/jpeg;base64,/, '');
    return Buffer.from(data, 'base64');
  }

  /**
   * Save canvas as file
   */
  public saveCanvas(url: string) {
    const data = this.encoder(url);
    try {
      const filepath = path.join(File.exportDir(), 'canvas.jpg');
      writeFile(filepath, data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Save canvas as file for print
   */
  public async savePrint(url: string) {
    const data = this.encoder(url);
    try {
      const filepath = path.join(File.exportDir(), 'print.jpg');
      await writeFile(filepath, data);
    } catch (error) {
      throw error;
    }
  }

  public print(quantity: number, split: boolean) {
    let files = '';
    const filepath = File.getPrintExport();
    for (let i = 0; i < quantity; i++) {
      files += filepath + ' ';
    }

    const worker = new Worker(
      path.join(__dirname, '../workers/printerWorker.js'),
      {
        workerData: {
          filePath: files,
          split: split,
        },
      }
    );
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
        `${store.getState().motion.index}.jpg`
      );
      writeFile(filepath, data);
      store.dispatch(increment());
    } catch (error) {
      throw error;
    }
  }

  /**
   * Start video rendering procedure
   */
  public async renderVideo() {
    console.log('attempting to render video');
    const path = File.motionDir();

    const targetPath = File.exportDir();

    const COMMAND = `ffmpeg -framerate 10 -i ${path}/%d.jpg -vf "fps=10" -pix_fmt yuv420p ./video.mp4`;

    const process = spawn('bash', ['-c', COMMAND], {
      cwd: targetPath,
    });
    process.stdout.on('error', (err) => {
      console.error(err);
      throw err;
    });
    await once(process, 'close');
    return;
  }
}

export const Media = new MediaService();
