import { logLevels } from '../shared/logLevels';
import winston, { createLogger, format, Logger, transports } from 'winston';
import path from 'path';
import { HttpPostTransport } from './HttpPostTransport';
import { app } from 'electron';

const formatter = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${label} [${level}]: ${message}`;
});

const logFilePath = path.join(app.getPath('logs'), 'app.log');

class LoggerFactory {
  private environment: 'development' | 'uat' | 'production';
  private logger: Logger = createLogger();

  constructor(
    environment: 'development' | 'uat' | 'production' = 'development'
  ) {
    this.environment = environment;

    this.logger = createLogger({
      levels: logLevels.levels,
      format: format.combine(
        format.colorize({ colors: logLevels.colors }),
        format.label({ label: environment }),
        format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        formatter
      ),
      transports: [
        new transports.Console({
          format: format.colorize({ all: true }),
        }),
        new HttpPostTransport({
          endpoint: 'https://timestamp.fun/api/boothLogs',
          headers: {
            Token: process.env.BOOTH_TOKEN,
          },
        }),
        this.environment != 'development'
          ? new transports.File({ filename: logFilePath })
          : new transports.File({ filename: 'debug.log', level: 'debug' }),
      ],
    });
  }

  public getInstance() {
    return this.logger;
  }

  public error(message: string, meta: Record<string, any>) {
    const entry: winston.LogEntry = {
      level: 'error',
      message: `${message}`,
      meta: meta,
    };
    this.logger.log(entry);
  }

  public warn(message: string, meta: Record<string, any>) {
    const entry: winston.LogEntry = {
      level: 'warn',
      message: `${message}`,
      meta: meta,
    };
    this.logger.log(entry);
  }

  public info(message: string, meta: Record<string, any>) {
    const entry: winston.LogEntry = {
      level: 'info',
      message: `${message}`,
      meta: meta,
    };
    this.logger.log(entry);
  }

  public trace(message: string, ...args: string[]) {
    const entry: winston.LogEntry = {
      level: 'trace',
      message: `${message} ${args}`,
    };
    this.logger.log(entry);
  }

  public debug(message: string, ...args: string[]) {
    const entry: winston.LogEntry = {
      level: 'debug',
      message: `${message} ${args}`,
    };
    this.logger.log(entry);
  }
}
const logger = new LoggerFactory(
  process.env.NODE_ENV as 'development' | 'uat' | 'production'
);

export default logger;
export const logPath = logFilePath;
