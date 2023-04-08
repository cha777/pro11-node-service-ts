export enum OSTypes {
  Windows = 'win32',
  Mac = 'darwin',
}

export enum ClientType {
  App = 1,
  Launcher = 2,
  Login = 3,
}

export enum AppState {
  WillDisconnect,
  NotRunning,
  Initializing,
  Ready,
  Running,
}
