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

export enum LogLevel {
  Error = 1,
  Warning = 2,
  Info = 4,
  Debug = 5,
}
