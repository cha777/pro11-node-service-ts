/**
 * This route configures proxy routes for the data api
 *
 * References:
 * ExpressHttpProxy NPM Module Doc      https://www.npmjs.com/package/express-http-proxy
 * */
import express, { Request } from 'express';
import proxy from 'express-http-proxy';
import url from 'url';

import { baseProxy } from './router-config';
import appConfig from '../../../app-config';

const router = express.Router();

/**
 * Explanation:
 *
 * Usually, if proxy address is www.example.com, express-http-proxy will reroute
 * /example/path => www.example.com/example/path
 *
 * but in this case we need to redirect,
 * /example/path => www.example.com/path
 *
 * so this method will replace the first section of the path
 *
 * @return string calculated path for the proxy url
 *
 * */

const getPath = (
  path: string,
  req: Request,
  baseProxy: string,
  appendToRestPath?: string,
): string => {
  let resPath = url.parse(req.url).path.replace(`/${path}`, '');

  // Removing protocols(http, https) in base url
  const restFromBaseUrlArr = baseProxy.split('//');

  if (restFromBaseUrlArr.length > 1) {
    restFromBaseUrlArr.shift();
  }

  const baseUrlWithoutProtocol = restFromBaseUrlArr.join();
  const restFromBaseUrl = baseUrlWithoutProtocol.split('/');

  restFromBaseUrl.shift(); // Removing base url

  if (appendToRestPath) {
    restFromBaseUrl.push(appendToRestPath);
  }

  // Creating Intermediate Routes
  if (restFromBaseUrl.length > 0) {
    const baseRoutes = restFromBaseUrl.join('/');
    resPath = `/${baseRoutes}` + resPath;
  }

  return resPath;
};

router.get(
  '/price',
  proxy(
    () => {
      return baseProxy.general;
    },
    {
      proxyReqPathResolver: (req) => {
        return getPath('price', req, baseProxy.general);
      },
    },
  ),
);

router.get(
  '/subMarket',
  proxy(
    () => {
      return baseProxy.general;
    },
    {
      proxyReqPathResolver: (req) => {
        return getPath('subMarket', req, baseProxy.general);
      },
    },
  ),
);

router.get(
  '/content',
  proxy(
    () => {
      return baseProxy.general;
    },
    {
      proxyReqPathResolver: (req) => {
        return getPath('content', req, baseProxy.general);
      },
    },
  ),
);

router.get(
  '/chart',
  proxy(
    () => {
      return baseProxy.general;
    },
    {
      proxyReqPathResolver: (req) => {
        return getPath('chart', req, baseProxy.general);
      },
    },
  ),
);

router.get(
  '/updateUser',
  proxy(
    () => {
      return baseProxy.updateUser;
    },
    {
      proxyReqPathResolver: (req) => {
        return getPath('updateUser', req, baseProxy.updateUser);
      },
    },
  ),
);

router.post(
  '/updateUser',
  proxy(
    () => {
      return baseProxy.updateUser;
    },
    {
      proxyReqPathResolver: (req) => {
        return getPath('updateUser', req, baseProxy.updateUser);
      },
    },
  ),
);

router.get(
  '/profile',
  proxy(
    () => {
      return baseProxy.profile;
    },
    {
      proxyReqPathResolver: (req) => {
        return getPath('profile', req, baseProxy.profile);
      },
    },
  ),
);

router.post(
  '/profile',
  proxy(
    () => {
      return baseProxy.profile;
    },
    {
      proxyReqPathResolver: (req) => {
        return getPath('profile', req, baseProxy.profile);
      },
    },
  ),
);

router.get(
  '/tradeReport',
  proxy(
    () => {
      return baseProxy.tradeRest;
    },
    {
      proxyReqPathResolver: (req) => {
        return getPath(
          'tradeReport',
          req,
          baseProxy.tradeRest,
          appConfig.tradeConfig.reportUrlPath,
        );
      },
    },
  ),
);

router.post(
  '/tradeReport',
  proxy(
    () => {
      return baseProxy.tradeRest;
    },
    {
      proxyReqPathResolver: (req) => {
        return getPath(
          'tradeReport',
          req,
          baseProxy.tradeRest,
          appConfig.tradeConfig.reportUrlPath,
        );
      },
    },
  ),
);

router.use(
  '/customerFiles',
  proxy(
    () => {
      return baseProxy.tradeRest;
    },
    {
      proxyReqPathResolver: (req) => {
        return getPath(
          'customerFiles',
          req,
          baseProxy.tradeRest,
          appConfig.tradeConfig.customerFileUrlPath,
        );
      },
    },
  ),
);

router.get(
  '/tradeInquiry',
  proxy(
    () => {
      return baseProxy.tradeRest;
    },
    {
      proxyReqPathResolver: (req) => {
        return getPath(
          'tradeInquiry',
          req,
          baseProxy.tradeRest,
          appConfig.tradeConfig.tradeInquiryUrlPath,
        );
      },
    },
  ),
);

router.post(
  '/tradeInquiry',
  proxy(
    () => {
      return baseProxy.tradeRest;
    },
    {
      proxyReqPathResolver: (req) => {
        return getPath(
          'tradeInquiry',
          req,
          baseProxy.tradeRest,
          appConfig.tradeConfig.tradeInquiryUrlPath,
        );
      },
    },
  ),
);

router.get(
  '/brokerage',
  proxy(
    () => {
      return baseProxy.brokerage;
    },
    {
      proxyReqPathResolver: (req) => {
        return getPath('brokerage', req, baseProxy.brokerage);
      },
    },
  ),
);

router.use(
  '/archive',
  proxy(
    () => {
      return baseProxy.archive;
    },
    {
      proxyReqPathResolver: (req) => {
        return getPath('archive', req, baseProxy.archive);
      },
    },
  ),
);

router.use(
  '/errorSubmit',
  proxy(
    () => {
      return baseProxy.errorReport;
    },
    {
      limit: '100mb',
      proxyReqPathResolver: (req) => {
        return getPath(
          'errorSubmit',
          req,
          baseProxy.errorReport,
          appConfig.tradeConfig.errorReportMidUrl,
        );
      },
    },
  ),
);

export default router;
