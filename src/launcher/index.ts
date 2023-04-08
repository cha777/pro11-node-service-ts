import { EventEmitter } from 'events';
import Logger from '../libs/logger';
import Service from './service';

const logger = new Logger('launcher-main');

export enum LauncherType {
  launcher = 'launcher',
  killer = 'killer',
}

class Launcher extends EventEmitter {
  type: string;
  service: Service;

  constructor(type: LauncherType) {
    super();

    logger.info('Creating a new launcher');

    const service = new Service();
    this.type = type;

    service.on('ready', () => {
      logger.info('Launcher Socket connection is open');

      if (this.type === LauncherType.launcher) {
        service.launchService();
      } else if (this.type === LauncherType.killer) {
        // TODO; Handler killer
      }
    });

    service.on('connect-error', () => {
      logger.err('Cannot connect to the server');

      if (this.type === LauncherType.launcher) {
        this._onConnectionFailed();
      }
    });

    service.on('launch-error', () => {
      logger.err('Application launch error');

      if (this.type === LauncherType.launcher) {
        this._onLaunchFailed();
      }
    });

    this.service = service;
  }

  _onConnectionFailed(): void {
    logger.info('Closing socket and assume no service is running');

    this.service.socket.close();
    this.emit('launch-failed');
  }

  _onLaunchFailed(): void {
    logger.info('Closing socket and killing app');
  }
}

export default Launcher;
