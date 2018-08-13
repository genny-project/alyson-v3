/* eslint-disable new-cap */
import React from 'react';
import { object, func } from 'prop-types';
import { StackNavigator, addNavigationHelpers } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';
import * as Pages from '../../views/pages';
import { store } from '../../redux';
import { routes } from '../../config';
import { navigator } from '../../utils';
import { Header } from '../components';

const addListener = createReduxBoundAddListener( 'root' );

export const AppStackNavigator = StackNavigator({
  ...routes,
  generic: () => <Pages.Generic />,
  logout: () => <Pages.Logout />,
}, {
  initialRouteName: 'generic',
  initialRouteParams: {
    layout: 'home',
  },
  cardStyle: {
    backgroundColor: '#FFF',
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

const App = ({ navigation, dispatch }) => (
  <AppStackNavigator
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

export default connect( mapStateToProps )( App );
