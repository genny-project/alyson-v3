import React from 'react';
import KeycloakContext from '../context';

export default props => (
  <KeycloakContext.Consumer {...props} />
);
