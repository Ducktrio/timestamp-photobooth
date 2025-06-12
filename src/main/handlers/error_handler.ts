import { BrowserWindow } from 'electron';
import logger from '../utilities/logger';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

export function setupGlobalErrorHandler(win: BrowserWindow) {
  mainWindow = win;

  process.on('uncaughtException', (error) => {
    handleCriticalError('uncaughtException', error);
  });

  process.on('unhandledRejection', (reason: any) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    handleCriticalError('unhandledRejection', error);
  });

  console.log('✅ Global error handler set up');
}

async function handleCriticalError(type: string, error: Error) {
  console.error(`🛑 ${type}:`, error);

  logger.error(error.message, {
    stack: error.stack,
  });

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow
      .loadFile(path.join(__dirname, '../renderer/fallback.html'))
      .catch((err) => {
        console.error('❌ Failed to load fallback page:', err);
      });
  }
}
