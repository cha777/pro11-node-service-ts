import { OSTypes } from './constants';

export const isWindows = ((): boolean => {
  return process.platform === OSTypes.Windows;
})();

export const isMac = ((): boolean => {
  return process.platform === OSTypes.Mac;
})();
