import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import App from './views/app';
import { KeycloakProvider } from './views/components';
import { store } from './redux';
import config from './config';

const Root = () => (
  <ReduxProvider store={store}>
    <KeycloakProvider
      baseUrl={config.keycloak.baseUrl}
      realm={config.keycloak.realm}
      clientId={config.keycloak.clientId}
    >
      <App />
    </KeycloakProvider>
  </ReduxProvider>
);

export default Root;
