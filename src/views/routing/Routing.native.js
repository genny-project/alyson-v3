/* eslint-disable new-cap */
import React from 'react';
import { DrawerNavigator, StackNavigator, SwitchNavigator } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import { sidebar } from '../../config';
import * as Pages from '../../views/pages';
import Sidebar from './sidebar';
import Header from './header';

const AuthenticatedStack = StackNavigator({
  home: Pages.Home,
  logout: Pages.Logout,
  alerts: Pages.Alerts,
  profile: Pages.Profile,
  chat: Pages.Chat,
}, {
  initialRouteName: 'home',
  navigationOptions: ({ navigation }) => ({
    header: <Header navigation={navigation} />,
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
    <Sidebar {...props} items={sidebar} />
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
