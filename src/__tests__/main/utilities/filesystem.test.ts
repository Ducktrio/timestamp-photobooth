import * as fs from 'fs/promises';
import * as path from 'path';
import {
  folderExists,
  fileExists,
  ensureFolderExists,
  writeFile,
  readFile,
  appendToFile,
  deleteFile,
  deleteFolder,
  listFolderContents,
  copyFile,
} from '../../../main/utilities/filesystem';

const TEST_DIR = path.resolve(__dirname, 'test-temp');
const TEST_FILE = path.join(TEST_DIR, 'test.txt');
const TEST_FILE_COPY = path.join(TEST_DIR, 'test-copy.txt');

beforeAll(async () => {
  await ensureFolderExists(TEST_DIR);
});

afterEach(async () => {
  const contents = await fs.readdir(TEST_DIR);
  for (const file of contents) {
    await fs.rm(path.join(TEST_DIR, file), { recursive: true, force: true });
  }
});

afterAll(async () => {
  await deleteFolder(TEST_DIR);
});

describe('fsUtils', () => {
  test('folderExists should detect existing folder', async () => {
    expect(await folderExists(TEST_DIR)).toBe(true);
  });

  test('fileExists should detect file existence correctly', async () => {
    await writeFile(TEST_FILE, 'Hello');
    expect(await fileExists(TEST_FILE)).toBe(true);
    expect(await fileExists(path.join(TEST_DIR, 'nonexistent.txt'))).toBe(
      false
    );
  });

  test('writeFile and readFile should work correctly', async () => {
    const content = 'Test content';
    await writeFile(TEST_FILE, content);
    const result = await readFile(TEST_FILE);
    expect(result).toBe(content);
  });

  test('appendToFile should add content to existing file', async () => {
    await writeFile(TEST_FILE, 'A');
    await appendToFile(TEST_FILE, 'B');
    const result = await readFile(TEST_FILE);
    expect(result).toBe('AB');
  });

  test('deleteFile should remove a file', async () => {
    await writeFile(TEST_FILE, 'X');
    await deleteFile(TEST_FILE);
    expect(await fileExists(TEST_FILE)).toBe(false);
  });

  test('deleteFolder should remove a folder and its contents', async () => {
    const subfolder = path.join(TEST_DIR, 'sub');
    const subfile = path.join(subfolder, 'file.txt');
    await ensureFolderExists(subfolder);
    await writeFile(subfile, 'Y');
    await deleteFolder(subfolder);
    expect(await folderExists(subfolder)).toBe(false);
  });

  test('listFolderContents should return file list', async () => {
    await writeFile(TEST_FILE, 'Z');
    const contents = await listFolderContents(TEST_DIR);
    expect(contents).toContain('test.txt');
  });

  test('copyFile should copy a file to new location', async () => {
    await writeFile(TEST_FILE, 'Copy this');
    await copyFile(TEST_FILE, TEST_FILE_COPY);
    expect(await fileExists(TEST_FILE_COPY)).toBe(true);
    const original = await readFile(TEST_FILE);
    const copied = await readFile(TEST_FILE_COPY);
    expect(copied).toBe(original);
  });
});
