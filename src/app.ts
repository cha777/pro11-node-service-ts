import { EventEmitter } from 'events';
import Launcher, { LauncherType } from './launcher';

global.appEvents = new EventEmitter();

export const startLauncher = (): void => {
  const launcher = new Launcher(LauncherType.launcher);

  launcher.on('launch-failed', async () => {
    await import('./service');
  });
};

export const startKiller = (): void => {
  new Launcher(LauncherType.killer);
};
