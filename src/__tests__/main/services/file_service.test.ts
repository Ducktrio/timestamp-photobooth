// No need for mocks because filepath are ensured to be mockked from file service
import { deleteFolder, folderExists } from '../../../main/utilities/filesystem';

jest.mock('electron');
import path from 'path';

describe('File service', () => {
  const testDir = path.join(process.cwd(), 'tests');

  beforeAll(async () => {
    if (await folderExists(testDir)) await deleteFolder(testDir);
  });

  it('should be empty', async () => {
    expect(await folderExists(testDir)).toBeFalsy();
  });
});
