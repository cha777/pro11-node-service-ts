import { EventEmitter } from 'events';
import appConfig from '../app-config';
import Logger from '../libs/logger';
import IPCSocket from './ipc-socket';

const logger = new Logger('launcher-service-connection');
const LAUNCH_SUCCESS_TIMEOUT = 10000;
const KILL_AND_LAUNCH_SUCCESS_TIMEOUT = 30000;

class Service extends EventEmitter {
  socket: IPCSocket;

  constructor() {
    super();
    this.socket = new IPCSocket();

    this.socket.on('auth-success', () => {
      this.emit('ready');
    });

    this.socket.on('connect-error', () => {
      this.emit('connect-error');
    });
  }

  /**
   * Request background service to be killed
   */
  killService(): void {
    logger.info('Send kill request and close the socket');

    this.socket.send('kill-request');
    this.socket.close();
  }

  /**
   * Request background service to take open fin to the foreground
   */
  launchService(): void {
    logger.info('send show-login to the server');

    let tries = 0;
    this.socket.send('show-login', { userName: process.env['USERNAME'] });

    let startAppValidator = setTimeout(() => {
      logger.warn('App validator time out. Fire launch error event');
      this.emit('launch-error');
    }, appConfig.launchConfig.launchSuccessTimeout || LAUNCH_SUCCESS_TIMEOUT);

    this.socket.subscribe('start-app-success', () => {
      logger.info('App start success. Closing launcher socket');

      this.socket.removeAllListeners('disconnect');
      clearTimeout(startAppValidator);
      this.socket.close();
    });

    this.socket.subscribe('start-app-failed', (reason) => {
      logger.warn(`start-app-failed reason: ${reason}`);

      if (reason === 'running') {
        process.exit(101);
      }

      if (tries >= appConfig.launchConfig.maxRetry) {
        logger.info('Maximum number of launch retry exceeded, Stop Retry');

        this.socket.removeAllListeners('disconnect');
        this.socket.close();
        return;
      }

      setTimeout(() => {
        logger.info('Retrying to launch app');
        tries++;
        this.socket.send('show-login');
      }, 2000);
    });

    this.socket.subscribe('stop-launch', (reason) => {
      logger.warn(`Launch stopped, reason: ${reason}`);

      this.socket.removeAllListeners('disconnect');
      clearTimeout(startAppValidator);
      this.socket.close();
    });

    this.socket.subscribe('start-service', () => {
      logger.warn(
        'Running service provide access to run new after disconnect the service',
      );

      clearTimeout(startAppValidator);

      this.socket.once('disconnect', () => {
        this.emit('connect-error', true);
      });

      startAppValidator = setTimeout(() => {
        logger.warn('App validator time out. Fire after start service');

        this.socket.removeAllListeners('disconnect');
        this.emit('launch-error');
      }, KILL_AND_LAUNCH_SUCCESS_TIMEOUT);
    });
  }
}

export default Service;
