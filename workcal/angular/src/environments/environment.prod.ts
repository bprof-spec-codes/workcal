import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'workcal',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:44387/',
    redirectUri: baseUrl,
    clientId: 'workcal_App',
    responseType: 'code',
    scope: 'offline_access workcal',
    requireHttps: true
  },
  apis: {
    default: {
      url: 'https://localhost:44387',
      rootNamespace: 'workcal',
    },
  },
} as Environment;
