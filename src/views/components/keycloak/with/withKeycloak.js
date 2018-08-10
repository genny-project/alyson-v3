import React from 'react';
import KeycloakConsumer from '../consumer';

const withKeycloak = Component => props => (
  <KeycloakConsumer>
    {keycloak => (
      <Component
        {...props}
        keycloak={keycloak}
      />
    )}
  </KeycloakConsumer>
);

export default withKeycloak;
