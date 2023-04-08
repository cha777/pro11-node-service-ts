import fs from 'fs';
import path from 'path';
import express, { Express } from 'express';

import { ProxySettings, updateBaseProxy } from './router-config';
import proxyRoutes from './proxy-routes';
import Logger from '../../../libs/logger';
import { connSettFile, distDir } from '../../pkg/directories';

const logger = new Logger('express');

let srcDir: string | null;

export const initializeRoutes = (app: Express): void => {
  app.use('/', proxyRoutes);

  /**
   * Application level middleware routes.
   */
  app.use('/', (_req, res, next) => {
    if (!srcDir) {
      logger.info('Setting src directory as static resource');

      srcDir = distDir;
      logger.info(`Src Dist dir ${srcDir}`);

      app.use(express.static(srcDir));

      return res.sendFile(path.join(srcDir, 'index.html'));
    } else {
      next();
    }
  });
};

type ConnectionSettings = {
  connectionParameters: { proxySettings: ProxySettings };
};

export const updateProxy = (): void => {
  if (fs.existsSync(connSettFile)) {
    try {
      const connectionSettings: ConnectionSettings = JSON.parse(
        fs.readFileSync(connSettFile, { encoding: 'utf8' }),
      );
      updateBaseProxy(connectionSettings.connectionParameters.proxySettings);
    } catch (err) {
      logger.err('Connection settings update failed' + err);
    }
  }
};
