import { logLevels } from '../shared/logLevels';
import winston, { createLogger, format, Logger, transports } from 'winston';
import { app } from 'electron';
import path from 'path';

const formatter = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${label} [${level}]: ${message}`;
});

const logFilePath = path.join(app.getPath('logs'), 'app.log');

class LoggerFactory {
  private environment: 'dev' | 'uat' | 'production';
  private logger: Logger = createLogger();

  constructor(environment: 'dev' | 'uat' | 'production' = 'dev') {
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
        this.environment != 'dev'
          ? new transports.File({ filename: logFilePath })
          : new transports.File({ filename: 'debug.log', level: 'debug' }),
      ],
    });
  }

  public getInstance() {
    return this.logger;
  }

  public error(message: string, ...args: string[]) {
    const entry: winston.LogEntry = {
      level: 'error',
      message: `${message} ${args}`,
    };
    this.logger.log(entry);
  }

  public warn(message: string, ...args: string[]) {
    const entry: winston.LogEntry = {
      level: 'warn',
      message: `${message} ${args}`,
    };
    this.logger.log(entry);
  }

  public info(message: string, ...args: string[]) {
    const entry: winston.LogEntry = {
      level: 'info',
      message: `${message} ${args}`,
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
  process.env.NODE_ENV as 'dev' | 'uat' | 'production'
);

export default logger;
export const logPath = logFilePath;
