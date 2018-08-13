/* eslint-disable new-cap */
import React from 'react';
import { DrawerNavigator, StackNavigator, SwitchNavigator } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import * as Pages from '../../views/pages';
import { store } from '../../redux';
import { navigator } from '../../utils';
import { Header } from '../components';
import Sidebar from './sidebar';
import AppStack from './AppStack';

const AppDrawer = DrawerNavigator({
  authenticated: () => <AppStack />,
}, {
  initialRouteName: 'authenticated',
  contentComponent: props => (
    <Sidebar {...props} />
  ),
});

const AuthStack = StackNavigator({
  public: () => <Pages.Public />,
}, {
  initialRouteName: 'public',
  initialRouteParams: {
    layout: 'splash',
  },
  cardStyle: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
  },
  navigationOptions: props => {
    const { headerProps, showHeader } = store.getState().layout;

    const shouldShowHeader = (
      showHeader &&
      headerProps != null &&
      Object.keys( headerProps ).length > 0
    );

    return {
      header: shouldShowHeader ? (
        <Header
          {...props}
          {...headerProps}
        />
      ) : null,
    };
  },
  transitionConfig: () => ({
    screenInterpolator: sceneProps => {
      return CardStackStyleInterpolator.forHorizontal( sceneProps );
    },
  }),
});

const Main = SwitchNavigator({
  loading: () => <Pages.Loading />,
  app: () => <AppDrawer />,
  auth: () => <AuthStack />,
}, {
  initialRouteName: 'loading',
});

export default (
  props => (
    <Main
      {...props}
      ref={ref => (
        navigator.setMainNavigator( ref )
      )}
    />
  )
);
