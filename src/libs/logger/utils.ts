import path from 'path';
import fs from 'fs';
import appConfig from '../../app-config';

export enum LogFileType {
  application = 'application.log',
  service = 'service.log',
}

export const logDir = ((): string => {
  const os = process.platform;
  let directfnDir: string;

  if (os === 'win32') {
    directfnDir = path.join(process.env.LOCALAPPDATA, 'DirectFN');
  } else if (os === 'darwin') {
    // TODO: Use proper path to support notarization
    directfnDir = path.join(process.env.HOME, 'DirectFN');
  } else {
    // Unsupported operating system
    return '';
  }

  const appDir = path.join(directfnDir, appConfig.bundleId);
  const logDir = path.join(appDir, 'logs');

  // Creating logs folder
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  return logDir;
})();
