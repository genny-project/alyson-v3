import React from 'react';
import { Redirect } from 'react-router-dom';
import * as Pages from '../../views/pages';

export default [
  {
    path: '/',
    component: Pages.Home,
    exact: true,
  },
  {
    path: '/login',
    component: Pages.Login,
  },
  {
    path: '/logout',
    component: Pages.Logout,
  },
  {
    path: '/register',
    component: Pages.Register,
  },
  {
    path: '/splash',
    component: Pages.Splash,
  },
  {
    path: '/auth',
    component: () => <Redirect to="/splash" />,
  },
  {
    path: '/app',
    component: () => <Redirect to="/" />,
  },
  {
    path: '/loading',
    component: Pages.Loading,
  },
];
