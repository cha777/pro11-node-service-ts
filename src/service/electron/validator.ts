import fs from 'fs';
import { runtimeDir } from '../pkg/directories';
import Logger from '../../libs/logger';

const logger = new Logger('electron-runtime-validator');

export const runtimeExists = (): boolean => {
  logger.info(`Validating runtime directory: ${runtimeDir}`);
  return fs.existsSync(runtimeDir);
};
