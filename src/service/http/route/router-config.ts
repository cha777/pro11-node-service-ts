export interface ProxySettings {
  general: string;
  profile: string;
  archive: string;
  updateUser?: string;
  errorReport?: string;
  tradeRest?: string;
  brokerage?: string;
}

export const baseProxy: ProxySettings = {
  general: 'data-sa9.mubasher.net/mix2/ClientServiceProvider',
  profile: 'data-sa9.mubasher.net/profile/DataHandler',
  archive: 'data-sa9.mubasher.net',
  updateUser: 'data-sa.mubasher.net/UpdateUserService-uat',
  errorReport: '192.168.14.69:3000',
  tradeRest: 'ntp-gateway.directfn.net/dfngateway',
};

export const updateBaseProxy = (proxySettings: ProxySettings): void => {
  if (proxySettings) {
    for (const prop in proxySettings) {
      baseProxy[prop] = proxySettings[prop];
    }
  }
};
