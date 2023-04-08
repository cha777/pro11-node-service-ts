import path from 'path';
import type { EventEmitter } from 'events';
import Logger from '../../libs/logger';
import { launch } from './launcher';
import { runtimeExists as runtimeValidator } from './validator';
import appConfig from '../../app-config';
import { AppState } from '../constants';

class NativeLauncher {
  private _appState: AppState;
  private _loginState: AppState;
  private logger: Logger;

  constructor() {
    this.logger = new Logger('electron');

    this._appState = AppState.NotRunning;
    this._loginState = AppState.NotRunning;
  }

  get appState(): AppState {
    return this._appState;
  }

  set appState(setAppState: AppState) {
    this._appState = setAppState;
  }

  get loginState(): AppState {
    return this._loginState;
  }

  set loginState(setLoginState: AppState) {
    this._loginState = setLoginState;
  }

  get runtimeExists(): boolean {
    return runtimeValidator();
  }

  public startNativeRuntime(): EventEmitter {
    this.logger.info('Starting Electron Runtime...');

    return launch({
      configPath: path.resolve(
        process.cwd(),
        'service/electron/package/index.js',
      ),
      startupUrl: appConfig.url,
    });
  }
}

const nativeLauncher = new NativeLauncher();
export default nativeLauncher;

export enum SplashMessage {
  Updating = 1,
  Restarting = 2,
  ReInstall = 3,
}
