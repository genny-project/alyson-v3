import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { object } from 'prop-types';
import { NavigationActions } from 'react-navigation';
import { Text, Box, KeycloakConsumer, Redirect, WebView } from '../../components';
import { store } from '../../../redux';
import Layout from '../../layout';
import config from '../../../config';

class Logout extends Component {
  static propTypes = {
    keycloak: object,
  }

  state = {
    // isLoggedInOnMount: false,
    isKeycloakSessionDestroyed: false,
    areTokensCleared: false,
  }

  componentDidMount() {
    this.doLogout();

    const { isAuthenticated } = this.props.keycloak;

    if ( isAuthenticated ) {
      // this.setState({ isLoggedInOnMount: true });
    }
  }

  doLogout = async () => {
    const { attemptLogout } = this.props.keycloak;

    store.dispatch(
      NavigationActions.popToTop()
    );

    try {
      await attemptLogout();
    }
    catch ( e ) {
      // eslint-disable-next-line no-console
      console.warn({ e });
    }

    this.setState({ areTokensCleared: true });
  }

  handleNavigationStateChange = event => {
    if ( event.url.startsWith( config.keycloak.redirectUri )) {
      this.setState({ isKeycloakSessionDestroyed: true });
    }
  }

  render() {
    const { error, isAuthenticated, createLogoutUrl } = this.props.keycloak;
    const { isKeycloakSessionDestroyed, areTokensCleared } = this.state;

    const logoutUrl = createLogoutUrl({
      redirect_uri: config.keycloak.redirectUri,
    });

    if (
      // isLoggedInOnMount ||
      (
        isKeycloakSessionDestroyed &&
        areTokensCleared &&
        !isAuthenticated
      )
    ) {
      return (
        <Redirect
          to="auth"
          useMainNavigator
          appTo="home"
        />
      );
    }

    if ( error )
      return (
        <Text>
          An error has occurred!
        </Text>
      );

    return (
      <Layout
        title="Logout"
        appColor="light"
        hideHeader
      >
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
          flexDirection="column"
          testID="page-logout"
        >
          <ActivityIndicator
            size="large"
          />

          <Box
            height={20}
          />

          <Text>
            Logging you out...
          </Text>
        </Box>

        <WebView
          source={{ uri: logoutUrl.url }}
          onNavigationStateChange={this.handleNavigationStateChange}
          height={0}
          width={0}
        />
      </Layout>
    );
  }
}

export default props => (
  <KeycloakConsumer>
    {keycloak => (
      <Logout
        {...props}
        keycloak={keycloak}
      />
    )}
  </KeycloakConsumer>
);
