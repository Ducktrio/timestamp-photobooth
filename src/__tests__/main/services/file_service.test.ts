jest.mock('electron');
import { File } from '../../../main/services/file_service';
import { folderExists } from '../../../main/utilities/filesystem';
import { app } from 'electron';
import { deleteFolderSync } from '../../../main/utilities/filesystem.sync';

describe('FileService', () => {
  beforeEach(() => {
    deleteFolderSync(app.getPath('userData'));
  });
  afterEach(async () => {
    deleteFolderSync(app.getPath('userData'));
  });
  it('ensure folder exists', async () => {
    await File.scanFolders();

    const doesExists = await Promise.all(
      Object.values(File.FOLDERPATH).map((value) => {
        return folderExists(value);
      })
    );

    expect(doesExists).toEqual([true, true, true, true]);

  });
});
