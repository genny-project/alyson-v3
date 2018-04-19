import { StackNavigator } from 'react-navigation';
import { routes } from '../../config';
// import * as Pages from '../../views/pages';

/*
const DrawerNav = DrawerNavigator({
  home: { screen: Pages.Home },
  login: { screen: Pages.Login },
  register: { screen: Pages.Register },
});

const Auth = StackNavigator({
  home: {
    screen: Pages.Home,
  },
  logout: {
    screen: Pages.Logout,
  },
}, {
  initialRouteName: 'home',
  navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor: 'green',
    },
    title: 'Authenticated',
    headerLeft: (
      <Text onPress={() => navigation.navigate( 'DrawerOpen' )}>
        Menu
      </Text>
    ),
  }),
});

const Unauth = StackNavigator({
  home: {
    screen: Pages.Home,
  },
  login: {
    screen: Pages.Login,
  },
  register: {
    screen: Pages.Register,
  },
}, {
  initialRouteName: 'home',
  navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor: 'red',
    },
    title: 'Unauthenticated',
    headerLeft: (
      <Text onPress={() => navigation.navigate( 'DrawerOpen' )}>
        Menu
      </Text>
    ),
  }),
});
*/

const Main = StackNavigator( routes, { // eslint-disable-line new-cap
  initialRouteName: 'splash',
});

export default Main;
