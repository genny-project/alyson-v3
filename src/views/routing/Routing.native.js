/* eslint-disable new-cap */
import { StackNavigator, SwitchNavigator } from 'react-navigation';
// import { routes } from '../../config';
import * as Pages from '../../views/pages';

const AppStack = StackNavigator({
  home: Pages.Home,
  logout: Pages.Logout,
});

const AuthStack = StackNavigator({
  splash: Pages.Splash,
  login: Pages.Login,
  register: Pages.Register,
});

const Main = SwitchNavigator({
  loading: Pages.Loading,
  app: AppStack,
  auth: AuthStack,
}, {
  initialRouteName: 'auth',
});

export default Main;
