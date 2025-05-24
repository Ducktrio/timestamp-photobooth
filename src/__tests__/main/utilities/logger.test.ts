import {
  deleteFileSync,
  fileExistsSync,
  readFileSync,
} from '../../../main/utilities/filesystem.sync';

jest.mock('winston', () => {
  const mFormat = {
    combine: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
    colorize: jest.fn(),
    label: jest.fn(),
  };
  const mTransport = {
    Console: jest.fn(),
    File: jest.fn(),
  };
  const mLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
  };
  return {
    format: mFormat,
    transports: mTransport,
    createLogger: jest.fn(() => mLogger),
  };
});

jest.mock('electron');
import { createLogger, transports } from 'winston';
import { logPath } from '../../../main/utilities/logger';

describe('Logger', () => {
  const originalEnv = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    if (fileExistsSync(logPath)) deleteFileSync(logPath);
  });

  afterAll(() => {
    process.env = originalEnv;
    if (fileExistsSync(logPath)) deleteFileSync(logPath);
  });

  it('log to console', async () => {
    const logger = require('../../../main/utilities/logger').default;
    logger.info('This is an info log');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(transports.Console).toHaveBeenCalled();
    expect(transports.File).toHaveBeenCalled();
    expect(createLogger).toHaveBeenCalled();
  });

  it('log error to stderr', async () => {
    const logger = require('../../../main/utilities/logger').default;
    logger.error('This is to test error level log');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(transports.Console).toHaveBeenCalled();
    expect(transports.File).toHaveBeenCalled();
    expect(createLogger).toHaveBeenCalled();
  });

  xit('log to console and file in production environment', async () => {
    process.env.NODE_ENV = 'production';
    jest.resetAllMocks();
    const newLogger = require('../../../main/utilities/logger').default;
    const stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);

    newLogger.info('This is info level log in production');

    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log(logPath);
    const fileContent = readFileSync(logPath);
    expect(stdoutSpy).toHaveBeenCalled();
    expect(fileContent).toContain('info test');
  });
});
