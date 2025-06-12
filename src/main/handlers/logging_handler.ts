import { ipcMain } from 'electron/main';
import logger from '../utilities/logger';

export const registerLoggingHandlers = () => {
  ipcMain.on('log/info', (_event, { message, meta }) => {
    logger.info(message, meta);
  });
  ipcMain.on('log/warn', (_event, { message, meta }) => {
    logger.warn(message, meta);
  });
  ipcMain.on('log/error', (_event, { message, meta }) => {
    logger.error(message, meta);
  });
};
