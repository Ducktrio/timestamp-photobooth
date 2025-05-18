import * as fs from 'fs';
import * as path from 'path';

/**
 * Check if a folder exists and is a directory.
 */
export function folderExistsSync(folderPath: string): boolean {
  try {
    const stat = fs.statSync(path.resolve(folderPath));
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Check if a file exists and is a file.
 */
export function fileExistsSync(filePath: string): boolean {
  try {
    const stat = fs.statSync(path.resolve(filePath));
    return stat.isFile();
  } catch {
    return false;
  }
}

/**
 * Create a folder if it doesn't exist.
 */
export function ensureFolderExistsSync(folderPath: string): void {
  if (!folderExistsSync(folderPath)) {
    fs.mkdirSync(path.resolve(folderPath), { recursive: true });
  }
}

/**
 * Read file contents as a string.
 */
export function readFileSync(filePath: string): string {
  return fs.readFileSync(path.resolve(filePath), 'utf-8');
}

/**
 * Write data to a file (creates or overwrites).
 */
export function writeFileSync(filePath: string, data: string): void {
  fs.writeFileSync(path.resolve(filePath), data, 'utf-8');
}

/**
 * Append data to a file (creates if it doesn't exist).
 */
export function appendToFileSync(filePath: string, data: string): void {
  fs.appendFileSync(path.resolve(filePath), data, 'utf-8');
}

/**
 * Delete a file.
 */
export function deleteFileSync(filePath: string): void {
  if (fileExistsSync(filePath)) {
    fs.unlinkSync(path.resolve(filePath));
  }
}

/**
 * Delete a folder and its contents recursively.
 */
export function deleteFolderSync(folderPath: string): void {
  if (folderExistsSync(folderPath)) {
    fs.rmSync(path.resolve(folderPath), { recursive: true, force: true });
  }
}

/**
 * List all files and directories in a folder.
 */
export function listFolderContentsSync(folderPath: string): string[] {
  return fs.readdirSync(path.resolve(folderPath));
}

/**
 * Copy a file from source to destination.
 */
export function copyFileSync(sourcePath: string, destPath: string): void {
  fs.copyFileSync(path.resolve(sourcePath), path.resolve(destPath));
}
