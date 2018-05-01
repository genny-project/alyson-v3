import React, { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { routes } from '../../config';

const Routing = () => (
  <BrowserRouter>
    <Fragment>
      {renderRoutes( routes )}
    </Fragment>
  </BrowserRouter>
);

export default Routing;
