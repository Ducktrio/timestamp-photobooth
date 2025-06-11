import { app } from 'electron';
import logger from 'main/utilities/logger';
import path from 'path';
import {
  deleteFile,
  ensureFolderExists,
  listFolderContents,
} from '../utilities/filesystem';

export class FileService {
  private userDataPath = app.getPath('userData');

  public FOLDERPATH = {
    captures: this.userDataPath + '/captures/',
    frames: this.userDataPath + '/frames/',
    exports: this.userDataPath + '/exports/',
    motions: this.userDataPath + '/motions/',
  };

  public captureDir() {
    return path.resolve(this.FOLDERPATH.captures);
  }

  public exportDir() {
    return path.resolve(this.FOLDERPATH.exports);
  }

  public motionDir() {
    return path.resolve(this.FOLDERPATH.motions);
  }

  /**
   * Scans working directory of session as specified in FOLDERPATH
   * Create folders if not yet exist
   */
  public async scanFolders() {
    await Promise.all([
      Object.values(this.FOLDERPATH).map((value) => {
        console.log(path.resolve(value));
        return ensureFolderExists(value);
      }),
    ]);
  }

  /**
   * Get absolute path of the print file
   */
  public getPrintExport() {
    return path.join(this.exportDir(), 'print.jpg');
  }

  /**
   * Get list of exports files
   *
   * Video, rendered frame, print file included.
   * @return Promise<string[]>
   */
  public async getExports() {
    try {
      let files: string[] = [];
      const dir = path.resolve(this.FOLDERPATH.exports);
      await listFolderContents(dir).then((value) => {
        value.forEach((file) => {
          files.push(path.join(dir, file));
        });
      });
      return files;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get filepaths of captured photo as array of string
   */
  public async getCaptures() {
    try {
      let files: string[] = [];
      const dir = path.resolve(this.FOLDERPATH.captures);
      await listFolderContents(dir).then((value) => {
        value.forEach((file) => {
          files.push(path.join(dir, file));
        });
      });
      return files;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Unlinks every content inside folder path of user data.
   *
   * Use this for cleaning workspace folder from earlier use of session
   */
  public async cleanWorkspace() {
    try {
      const captures = await listFolderContents(this.FOLDERPATH.captures);
      const motions = await listFolderContents(this.FOLDERPATH.motions);
      const exports = await listFolderContents(this.FOLDERPATH.exports);

      if (!captures.length && !motions.length && !exports.length) {
        logger.warn('workspace folder already empty when attempting to clean');
        return;
      }

      await Promise.all([
        captures.map((value) => {
          return deleteFile(path.join(this.FOLDERPATH.captures, value));
        }),
        motions.map((value) => {
          return deleteFile(path.join(this.FOLDERPATH.motions, value));
        }),
        exports.map((value) => {
          return deleteFile(path.join(this.FOLDERPATH.exports, value));
        }),
      ]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Return an absolute path to the video export
   */
  public getVideo() {
    return path.join(this.exportDir(), 'video.mp4');
  }

  /**
   * Return an absolute path to the exported canvas
   */
  public getCanvasExport(): string {
    return path.join(this.exportDir(), 'canvas.jpg');
  }
}

export const File = new FileService();
