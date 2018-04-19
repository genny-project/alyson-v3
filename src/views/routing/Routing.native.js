/* eslint-disable new-cap */
// import React from 'react';
import { StackNavigator, SwitchNavigator } from 'react-navigation';
// import { Text } from 'react-native';
// import { routes } from '../../config';
import { Header } from '../layout';
import * as Pages from '../../views/pages';

const AppStack = StackNavigator({
  home: Pages.Home,
  logout: Pages.Logout,
}, {
  navigationOptions: {
    headerTitle: Header,
  },
});

const AuthStack = StackNavigator({
  splash: Pages.Splash,
  login: Pages.Login,
  register: Pages.Register,
}, {
  navigationOptions: {
    headerTitle: Header,
    headerStyle: {
      backgroundColor: '#232323',
      height: 60,
    },
  },
});

const Main = SwitchNavigator({
  loading: Pages.Loading,
  app: AppStack,
  auth: AuthStack,
}, {
  initialRouteName: 'auth',
});

export default Main;
