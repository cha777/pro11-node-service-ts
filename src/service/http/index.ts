/**
 *
 * ============================================================================
 *
 * This is the express server module for the openfin service application,
 * which will provide a http interface for the application to interact with
 * application launcher and other required services
 *
 * ============================================================================
 * Events
 *
 * ready            when express server is ready
 * ============================================================================
 *
 * */

import express from 'express';
import http from 'http';
import { EventEmitter } from 'events';
import { initializeRoutes, updateProxy } from './route';
import Logger from '../../libs/logger';
import appConfig from '../../app-config';

const app = express();
const server = http.createServer(app);

class HttpServer {
  public emitter: EventEmitter;
  public server: http.Server;

  private logger: Logger;

  constructor() {
    this.emitter = new EventEmitter();
    this.logger = new Logger('express');
    this.server = server;

    initializeRoutes(app);

    /*
     * NOTE:
     * The ip is bind with 127.0.0.1 in order to make sure the api is
     * only accessed from the current machine for security reasons, do
     * not change this address without any reasonable matter
     * */
    server.listen(appConfig.port, '127.0.0.1', () => {
      this.logger.info(`Express server started on port ${appConfig.port}`);
      this.emitter.emit('ready', appConfig.port);
    });

    updateProxy();
  }
}

export default new HttpServer();
