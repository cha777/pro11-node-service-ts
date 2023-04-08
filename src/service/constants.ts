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

export enum StorageScope {
  App = 1,
  User = 2,
  Workspace = 3,
  Container = 4,
  Meta = 5,
}
