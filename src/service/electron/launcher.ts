import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';

import Logger from '../../libs/logger';
import { runtimeDir } from '../pkg/directories';
import appConfig from '../../app-config';

const logger = new Logger('electron-launcher');

type launchOptions = {
  configPath: string;
  startupUrl: string;
};

export const launch = ({
  configPath,
  startupUrl,
}: launchOptions): EventEmitter => {
  logger.info('spawning electron process');

  const appListener = new EventEmitter();

  fs.promises
    .stat(path.resolve(runtimeDir))
    .then(() => {
      const child = spawn(runtimeDir, [configPath, startupUrl], {
        env: { ...process.env, ELECTRON_ENV: appConfig.env.toString() },
      });

      child.stdout.on('data', (data) => {
        logger.info(data.toString().trim());
      });

      child.stderr.on('data', (data) => {
        logger.err(data.toString().trim());
      });

      child.on('exit', (code) => {
        logger.warn(`electron launcher exit with code: ${code}`);
        appListener.emit('exit', code);
      });

      child.on('close', (code) => {
        logger.warn(`electron launcher close with code: ${code}`);
        appListener.emit('app-close', code);
      });

      appListener.emit('app-started');
    })
    .catch((err) => {
      logger.err(`Runtime directory error: ${runtimeDir}, err: ${err}`);
    });

  return appListener;
};
