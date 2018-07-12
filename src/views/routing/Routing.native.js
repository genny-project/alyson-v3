/* eslint-disable new-cap */
import React from 'react';
import { object, func } from 'prop-types';
import { DrawerNavigator, StackNavigator, SwitchNavigator, addNavigationHelpers } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';
import * as Pages from '../../views/pages';
import { routes } from '../../config';
import { navigator } from '../../utils';
import { Header } from '../components';
import Sidebar from './sidebar';

const addListener = createReduxBoundAddListener( 'root' );

const AppStack = StackNavigator({
  ...routes,
  logout: () => <Pages.Logout />,
  generic: () => <Pages.Generic />,
}, {
  cardStyle: {
    backgroundColor: '#FFF',
    shadowColor: 'transparent',
  },
  navigationOptions: props => {
    const showHeader = (
      props.navigation.state.params &&
      props.navigation.state.params.showHeader
    );

    const headerProps = (
      props.navigation.state.params &&
      props.navigation.state.params.headerProps
    );

    return {
      header: showHeader ? (
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

const App = ({ navigation, dispatch }) => (
  <AppStack
    ref={ref => (
      navigator.setTopLevelAppNavigator( ref )
    )}
    navigation={addNavigationHelpers({
      dispatch: dispatch,
      state: navigation,
      addListener,
    })}
  />
);

App.propTypes = {
  navigation: object,
  dispatch: func,
};

const mapStateToProps = state => ({
  navigation: state.navigation,
});

const ConnectedAppStack = connect( mapStateToProps )( App );

const AppDrawer = DrawerNavigator({
  authenticated: () => <ConnectedAppStack />,
}, {
  initialRouteName: 'authenticated',
  contentComponent: props => (
    <Sidebar {...props} />
  ),
});

const AuthStack = SwitchNavigator({
  splash: () => <Pages.Splash />,
  login: () => <Pages.Login />,
  register: () => <Pages.Register />,
}, {
  initialRouteName: 'splash',
});

const Main = SwitchNavigator({
  loading: () => <Pages.Loading />,
  app: AppDrawer,
  auth: AuthStack,
}, {
  initialRouteName: 'loading',
});

export { AppStack };

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
