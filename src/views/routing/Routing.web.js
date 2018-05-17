import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { renderRoutes } from 'react-router-config';
import { routes } from '../../config';
import { history } from '../../redux';

const Routing = () => (
  <ConnectedRouter history={history}>
    {renderRoutes( routes )}
  </ConnectedRouter>
);

export default Routing;
