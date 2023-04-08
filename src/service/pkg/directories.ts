import fs from 'fs';
import path from 'path';
import appConfig from '../../app-config';
import Logger from '../../libs/logger';
import { isMac, isWindows } from '../utils';

const logger = new Logger('directories');

/**
 * When executable is running after the compilations, node globals
 * __dirname, __filename will be changed, ( see pkg compiler
 * documentation), this is the correct app path
 * */
export const appDir = ((): string => {
  const execPath = process.execPath;
  const lastIndex = execPath.lastIndexOf(path.sep);
  let appDir: string;

  if (lastIndex !== -1) {
    appDir = execPath.slice(0, lastIndex);
    logger.info(`appDir: ${appDir}`);
  } else {
    logger.err('Cannot set appDir');
  }

  return appDir;
})();

export const appDataDir = ((): string => {
  let appDataDir: string;

  if (isWindows) {
    appDataDir = path.join(process.env['LOCALAPPDATA']);
  } else if (isMac) {
    appDataDir = process.env['HOME'];
  } else {
    logger.err('Unsupported OS Type');
  }

  return appDataDir;
})();

export const directfnDir = ((): string => {
  const dfnDir = path.join(appDataDir, 'DirectFN');

  // Creating directfn folder if not exists
  if (!fs.existsSync(dfnDir)) {
    fs.mkdirSync(dfnDir);
  }

  return dfnDir;
})();

export const dfnAppDir = ((): string => {
  const appIdDir = path.join(directfnDir, appConfig.bundleId);

  if (!fs.existsSync(appIdDir)) {
    fs.mkdirSync(appIdDir);
  }

  return appIdDir;
})();

/**
 * This method will return the assets folder directory of the configured
 * bundleId
 *
 * @cfg bundleId see appConfig.js, need to be configured in each appUrl
 * @return string the absolute path to the application assets
 * */
export const assetDir = ((): string => {
  const dir = path.resolve('../../../assets');

  logger.info(`assetDir: ${dir}`);

  return dir;
})();

export const serviceDir = path.join(assetDir, 'shadowInstaller', 'app');

/**
 * Data persistance storage path
 */
export const storageDir = ((): string => {
  const dir = path.join(dfnAppDir, `storage`);

  logger.info(`storageDir: ${dir}`);

  return dir;
})();

export const runtimeDir = ((): string => {
  let runtimePath: string;

  if (isWindows) {
    runtimePath = path.resolve(serviceDir, 'bin', `${appConfig.name}.exe`);
  } else if (isMac) {
    runtimePath = path.resolve(
      serviceDir,
      'bin',
      `${appConfig.name}.app`,
      `Contents/MacOS/${appConfig.name}`,
    );
  }

  logger.info(`Runtime path: ${runtimePath}`);

  return runtimePath;
})();

export const runnerDir = ((): string => {
  const runnerDir = path.resolve('../../../');

  logger.info(`Runner.exe path: ${runnerDir}`);

  return runnerDir;
})();

/**
 * Temporary file for handling Splash Screen. This will be removed in future versions after
 * establishing websocket connection
 */
export const tempFile = path.join(serviceDir, 'temp.dat');

export const versionInfoFile = path.join(assetDir, 'versionInfo.JSON');
export const distDir = path.join(assetDir, 'app', 'dist');
export const updateStatFile = path.join(assetDir, 'updateStat.JSON');
export const shadowInstallerDir = path.join(assetDir, 'shadowInstaller');
export const connSettFile = path.join(distDir, 'connection-settings.json');
export const releaseNoteFile = path.join(assetDir, 'releaseNote.JSON');
