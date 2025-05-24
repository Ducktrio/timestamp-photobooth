import path from 'path';
jest.mock('electron', () => {
  return {
    app: {
      getPath: jest.fn().mockReturnValue(path.join(process.cwd(), 'mock-test')),
    },
  };
});
import { File } from '../../../main/services/file_service';
import { app } from 'electron';
import {
  deleteFolderSync,
  folderExistsSync,
} from '../../../main/utilities/filesystem.sync';

describe('FileService', () => {
  beforeEach(() => {
    if (folderExistsSync(app.getPath('userData')))
      deleteFolderSync(app.getPath('userData'));
  });
  afterAll(() => {
    deleteFolderSync(app.getPath('userData'));
  });
  it('ensure folder exists', async () => {
    await File.scanFolders();

    // IDK why but the promise all from scanFolders() have early resolve issue, have to wait a second
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const doesExists = Object.values(File.FOLDERPATH).map((value) => {
      return folderExistsSync(value);
    });
    expect(doesExists).toEqual([true, true, true, true]);
  });
});
