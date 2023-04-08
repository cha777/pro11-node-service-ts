import path from 'path';
import type { Logger } from 'winston';
import { createLogger, format, transports } from 'winston';
import appConfig, { ENV } from '../../app-config';
import { logDir, LogFileType } from './utils';

const { combine, printf } = format;

const loggerFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} - ${level}: ${message}`;
});

const _createWinstonLogger = (type: LogFileType): Logger => {
  const logger = createLogger({
    transports: [
      new transports.File({
        level: 'info',
        filename: path.join(logDir, type),
        format: combine(
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss:SSS',
          }),
          loggerFormat,
        ),
        maxsize: appConfig.loggerConfig.maxSize * 1024 * 1024,
      }),
    ],

    exceptionHandlers: [
      new transports.File({
        filename: path.join(logDir, `${type}-exceptions.log`),
      }),
    ],
  });

  if (appConfig.env === ENV.DEV) {
    logger.add(
      new transports.Console({
        level: 'info',
        format: combine(
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss:SSS',
          }),
          loggerFormat,
        ),
      }),
    );
  }

  return logger;
};

export const serviceLogger = _createWinstonLogger(LogFileType.service);
export const appLogger = _createWinstonLogger(LogFileType.application);
