import React from 'react';
import { Redirect } from '../../views/components';
import * as Pages from '../../views/pages';

const routes = [
  {
    path: '/logout',
    exact: true,
    component: Pages.Logout,
  },
  {
    path: '/',
    exact: true,
    component: Pages.Splash,
  },
  {
    path: '/auth',
    exact: true,
    component: () => <Redirect to="splash" />,
  },
  {
    path: '/app',
    exact: true,
    component: () => <Redirect to="home" />,
  },
  {
    path: '/loading',
    exact: true,
    component: Pages.Loading,
  },
  {
    path: '*',
    component: Pages.Generic,
  },
];

export default routes;
