import { join } from 'path';
import fs from 'fs-extra';
import { StorageScope } from '../constants';
import { storageDir } from '../pkg/directories';

export interface StorageProperties {
  user?: string;
  workspaceId?: string;
  containerIndex?: number;
}

const _getScopeFolder = (
  properties: StorageProperties,
  scope: StorageScope,
): string => {
  let dir = storageDir;

  if (scope === StorageScope.App) {
    return dir;
  }

  dir = join(dir, properties.user || 'default');

  if (scope === StorageScope.User) {
    return dir;
  }

  if (scope === StorageScope.Meta) {
    return join(dir, 'meta');
  }

  dir = join(dir, `${properties.workspaceId || 'default'}`);

  if (scope === StorageScope.Workspace) {
    return dir;
  }

  if (properties.containerIndex || properties.containerIndex === 0) {
    dir = join(dir, properties.containerIndex.toString());
  } else {
    dir = join(dir, 'default');
  }

  return dir;
};

const _getFullPath = (folder: string, key: string): string => {
  return join(folder, key + '.dat');
};

const _writeFile = async (fullPath: string, value: string): Promise<void> => {
  await fs.outputFile(fullPath, value);
};

const _readFile = async (folder: string, key: string): Promise<string> => {
  const fullPath = _getFullPath(folder, key);

  try {
    const data = await fs.readFile(fullPath);
    return data.toString('utf8');
  } catch (e) {
    return null;
  }
};

export const set = async (
  properties: StorageProperties,
  scope: StorageScope,
  key: string,
  value: string,
): Promise<void> => {
  const folderName = _getScopeFolder(properties, scope);
  const fullPath = _getFullPath(folderName, key);

  await _writeFile(fullPath, value);
};

export const get = async (
  properties: StorageProperties,
  scope: StorageScope,
  key: string,
): Promise<string> => {
  const folderName = _getScopeFolder(properties, scope);
  const data = await _readFile(folderName, key);

  return data;
};
