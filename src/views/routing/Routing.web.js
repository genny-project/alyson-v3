import React, { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { routes } from '../../config';
import Header from './header';
// import Sidebar from './sidebar';

const Routing = () => (
  <BrowserRouter>
    <Fragment>
      <Header />

      {renderRoutes( routes )}
    </Fragment>
  </BrowserRouter>
);

export default Routing;
