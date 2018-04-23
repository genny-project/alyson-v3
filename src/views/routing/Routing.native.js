/* eslint-disable new-cap */
import React from 'react';
import { DrawerNavigator, StackNavigator, SwitchNavigator } from 'react-navigation';
// import { routes } from '../../config';
import * as Pages from '../../views/pages';
import Sidebar from './sidebar';
import Header from './header';

const sidebarItems = [
  {
    name: 'Home',
    path: 'home',
    icon: 'chevron-right',
  },
  {
    name: 'Dropdown',
    isDropdown: true,
    items: [
      {
        name: 'Home',
        path: 'home',
        icon: 'chevron-right',
      },
      {
        name: 'Another dropdown',
        isDropdown: true,
        items: [
          {
            name: 'Home',
            path: 'home',
            icon: 'chevron-right',
          },
        ],
      },
      {
        name: 'Logout',
        path: 'logout',
        icon: 'chevron-right',
      },
    ],
  },
  {
    name: 'Chat',
    path: 'chat',
    icon: 'chevron-right',
  },
  {
    name: 'Alerts',
    path: 'alerts',
    icon: 'chevron-right',
  },
  {
    name: 'Profile',
    path: 'profile',
    icon: 'chevron-right',
  },
  {
    name: 'Logout',
    path: 'logout',
    icon: 'chevron-right',
  },
];

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
});

const AuthenticatedDrawer = DrawerNavigator({
  authenticated: AuthenticatedStack,
}, {
  initialRouteName: 'authenticated',
  contentComponent: props => (
    <Sidebar {...props} items={sidebarItems} />
  ),
});

const AuthStack = SwitchNavigator({
  splash: Pages.Splash,
  login: Pages.Login,
  register: Pages.Register,
}, {
});

const Main = SwitchNavigator({
  loading: Pages.Loading,
  app: AuthenticatedDrawer,
  auth: AuthStack,
}, {
  initialRouteName: 'app',
});

export default Main;
