import merge from 'ts-deepmerge';
import appConfigExtended from './app-config-extended';

type ModuleConfig = { key: string; path: string };

export interface AppConfig {
  env: ENV;
  port: number;
  name: string;
  bundleId: string;
  url: string;
  loggerConfig: { maxSize: number };
  pushUpdateConfig: {
    isEnabled: boolean;
    updateCheckInterval: number;
    maxOldVersionsLimit: number;
  };
  launchConfig: {
    launchSuccessTimeout: number;
    maxRetry: number;
    isSplashEnable: boolean;
  };
  moduleConfig: {
    preInitModules: ModuleConfig[];
    postInitModules: ModuleConfig[];
  };
  profileServiceConfig: { isEnabled: boolean };
  tradeConfig: {
    isCustomerSearchEnabled: boolean;
    reportUrlPath: string;
    customerFileUrlPath: string;
    tradeInquiryUrlPath: string;
    errorReportMidUrl: string;
  };
}

const port = 45332;

export enum ENV {
  DEV = 1,
  PROD = 2,
}

const baseAppConfig: AppConfig = {
  // Application Environment
  env: 1,

  // Port to be listened in express server and socket.io server
  port: port,

  name: 'DirectFN Pro11 Price',
  bundleId: 'com.directfn.pro11.price-qa',
  url: '',

  loggerConfig: {
    maxSize: 10, // Size in MB
  },
  pushUpdateConfig: {
    isEnabled: false,
    updateCheckInterval: 900000, // 15 Minutes
    maxOldVersionsLimit: 2,
  },
  launchConfig: {
    launchSuccessTimeout: 15000,
    maxRetry: 10, // Maximum retries when launch fail
    isSplashEnable: true,
  },
  moduleConfig: {
    preInitModules: [],

    postInitModules: [
      // { key: 'pkg', path: './pkg' },
      // { key: 'profile', path: './profile' },
      // { key: 'archive', path: './archive' },
      // { key: 'timeAndSales', path: './timeAndSales' },
      // { key: 'chart', path: './chart' },
      // { key: 'bigTrades', path: './bigTrade' },
      // { key: 'marketActivity', path: './marketActivity' },
      // { key: 'scanner', path: './scanner' },
      // { key: 'report', path: './report' },
      // { key: 'exportService', path: './export' },
      // { key: 'userDataExport', path: './userDataExport' },
      // { key: 'twitter', path: './twitter' },
      // { key: 'outlook', path: './outlook' },
      // { key: 'metaStock', path: './metaStock' },
      // { key: 'errorReport', path: './errorReport' },
    ],
  },
  profileServiceConfig: {
    isEnabled: true,
  },
  tradeConfig: {
    isCustomerSearchEnabled: false, // Customer search DT
    reportUrlPath: 'rest/aura-server/client/report/dtReports',
    customerFileUrlPath: 'rest/system/customersList',
    tradeInquiryUrlPath: 'rest/services/common/inq',
    errorReportMidUrl: 'errReport/submit',
  },
};

const appConfig = merge(baseAppConfig, appConfigExtended);
appConfig.url = `http://localhost:${appConfig.port}`;

export default appConfig;
