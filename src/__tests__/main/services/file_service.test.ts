import { File } from '../../../main/services/file_service';
import { deleteFolder, folderExists } from '../../../main/utilities/filesystem';

jest.mock('electron');

describe('FileService', () => {
  it('ensure folder exists', async () => {
    await File.scanFolders();

    const doesExists = await Promise.all(
      Object.values(File.FOLDERPATH).map((value) => {
        return folderExists(value);
      })
    );

    expect(doesExists).toEqual([true, true, true, true]);

    await deleteFolder(process.cwd() + '/tests/');
  });
});
