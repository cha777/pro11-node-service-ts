declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ELECTRON_ENV?: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}

export {};
