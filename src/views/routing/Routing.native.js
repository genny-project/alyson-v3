/* eslint-disable new-cap */
import React from 'react';
import { DrawerNavigator, StackNavigator, SwitchNavigator } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import * as Pages from '../../views/pages';
import { routes } from '../../config';
import Sidebar from './sidebar';
import Header from './header';

const AuthenticatedStack = StackNavigator({
  ...routes,
  generic: Pages.Generic,
}, {
  initialRouteName: 'generic',
  initialRouteParams: {
    layout: 'home',
    test: true,
  },
  navigationOptions: props => ({
    header: <Header {...props} />,
  }),
  transitionConfig: () => ({
    screenInterpolator: sceneProps => {
      return CardStackStyleInterpolator.forHorizontal( sceneProps );
    },
  }),
});

const AuthenticatedDrawer = DrawerNavigator({
  authenticated: AuthenticatedStack,
}, {
  initialRouteName: 'authenticated',
  contentComponent: props => (
    <Sidebar {...props} />
  ),
});

const AuthStack = SwitchNavigator({
  splash: Pages.Splash,
  login: Pages.Login,
  register: Pages.Register,
}, {
  initialRouteName: 'splash',
});

const Main = SwitchNavigator({
  loading: Pages.Loading,
  app: AuthenticatedDrawer,
  auth: AuthStack,
}, {
  initialRouteName: 'loading',
});

export default Main;
