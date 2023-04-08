import winston from 'winston';
import { LogFileType } from './utils';
import { appLogger, serviceLogger } from './winston-logger';

class Logger {
  private lbl: string;
  private currentLogger: winston.Logger;

  constructor(lbl: string, logType: LogFileType = LogFileType.service) {
    this.lbl = lbl;

    if (logType === LogFileType.service) {
      this.currentLogger = serviceLogger;
    } else if (logType === LogFileType.application) {
      this.currentLogger = appLogger;
    }
  }

  info = (message: string): void => {
    this.currentLogger.info(this._extendLog(message));
  };

  err = (message: string): void => {
    this.currentLogger.error(this._extendLog(message));
  };

  warn = (message: string): void => {
    this.currentLogger.warn(this._extendLog(message));
  };

  debug = (message: string): void => {
    this.currentLogger.debug(this._extendLog(message));
  };

  private _extendLog = (message: string): string => {
    return `${message} - ${this.lbl}`;
  };
}

export default Logger;
