import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * Check if a folder exists and is a directory.
 */
export async function folderExists(folderPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(path.resolve(folderPath));
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Check if a file exists and is a file.
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(path.resolve(filePath));
    return stat.isFile();
  } catch {
    return false;
  }
}

/**
 * Create a folder if it doesn't exist.
 */
export async function ensureFolderExists(folderPath: string): Promise<void> {
  if (!(await folderExists(folderPath))) {
    await fs.mkdir(folderPath, { recursive: true });
  }
}

/**
 * Read file contents as a string.
 */
export async function readFile(filePath: string): Promise<string> {
  return await fs.readFile(path.resolve(filePath), 'utf-8');
}

/**
 * Write data to a file (creates or overwrites).
 */
export async function writeFile(filePath: string, data: string): Promise<void> {
  await fs.writeFile(path.resolve(filePath), data, 'utf-8');
}

/**
 * Append data to a file (creates if it doesn't exist).
 */
export async function appendToFile(
  filePath: string,
  data: string
): Promise<void> {
  await fs.appendFile(path.resolve(filePath), data, 'utf-8');
}

/**
 * Delete a file.
 */
export async function deleteFile(filePath: string): Promise<void> {
  if (await fileExists(filePath)) {
    await fs.unlink(path.resolve(filePath));
  }
}

/**
 * Delete a folder and its contents recursively.
 */
export async function deleteFolder(folderPath: string): Promise<void> {
  if (await folderExists(folderPath)) {
    await fs.rm(path.resolve(folderPath), { recursive: true, force: true });
  }
}

/**
 * List all files and directories in a folder.
 */
export async function listFolderContents(
  folderPath: string
): Promise<string[]> {
  return await fs.readdir(path.resolve(folderPath));
}

/**
 * Copy a file from source to destination.
 */
export async function copyFile(
  sourcePath: string,
  destPath: string
): Promise<void> {
  await fs.copyFile(path.resolve(sourcePath), path.resolve(destPath));
}
