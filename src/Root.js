import React from 'react';
import App from './views/app';
import { KeycloakProvider } from './views/components';
import config from './config';

const Root = () => (
  <KeycloakProvider
    baseUrl={config.keycloak.baseUrl}
    realm={config.keycloak.realm}
    clientId={config.keycloak.clientId}
  >
    <App />
  </KeycloakProvider>
);

export default Root;
