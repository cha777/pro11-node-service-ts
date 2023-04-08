import Logger from '../../libs/logger';
import { LogFileType } from '../../libs/logger/utils';
import { LogLevel } from '../constants';

const logger = new Logger('app', LogFileType.application);

export const generateLogEntry = (level: LogLevel, entry: string): void => {
  switch (level) {
    case LogLevel.Error:
      logger.err(entry);
      break;

    case LogLevel.Warning:
      logger.warn(entry);
      break;

    case LogLevel.Info:
      logger.info(entry);
      break;

    case LogLevel.Debug:
      logger.debug(entry);
      break;

    default:
      logger.err(entry);
      break;
  }
};
