import { app } from 'electron';
import path from 'path';
import {
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

  /**
   * Scans working directory of session as specified in FOLDERPATH
   * Create folders if not yet exist
   */
  public async scanFolders() {
    await Promise.all([
      Object.values(this.FOLDERPATH).map((value) => {
        return ensureFolderExists(value);
      }),
    ]);
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
      listFolderContents(path.resolve(this.FOLDERPATH.exports)).then(
        (value) => {
          value.forEach((file) => {
            files.push(path.join(path.resolve(this.FOLDERPATH.exports), file));
          });
        }
      );
      return files;
    } catch (error) {
      throw error;
    }
  }

  public async getCaptures() {
    try {
    } catch (error) {
      throw error;
    }
  }
}

export const File = new FileService();
