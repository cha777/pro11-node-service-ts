import Logger from './libs/logger';
import { startKiller, startLauncher } from './app';

const logger = new Logger('app-main');
const arg = process.argv[2];

switch (arg) {
  case 'launcher':
    startLauncher();
    break;

  case 'killer':
    startKiller();
    break;

  default:
    logger.err('Invalid argument: ' + arg);
    break;
}
