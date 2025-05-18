import { app } from 'electron';
import { ensureFolderExists } from '../utilities/filesystem';

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

  public async getExports() {}
}

export const File = new FileService();
