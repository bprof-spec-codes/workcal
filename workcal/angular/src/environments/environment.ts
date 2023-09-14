import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

export const environment = {
  production: false,
  application: {
    baseUrl,
    name: 'workcal',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:44380/',
    redirectUri: baseUrl,
    clientId: 'workcal_App',
    responseType: 'code',
    scope: 'offline_access workcal',
    requireHttps: true,
  },
  apis: {
    default: {
      url: 'https://localhost:44380',
      rootNamespace: 'workcal',
    },
  },
} as Environment;
