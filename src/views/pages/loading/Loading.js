import React, { Component } from 'react';
import { object } from 'prop-types';
import { ActivityIndicator, StatusBar } from 'react-native';
import { KeycloakConsumer, Redirect, Box } from '../../components';
import Layout from '../../layout';

class Loading extends Component {
  static propTypes = {
    keycloak: object,
  }

  render() {
    const { isAuthenticated, isAuthenticating, isCheckingStorage, isCheckingCallback } = this.props.keycloak;

    if ( isAuthenticated ) {
      return <Redirect to="app" />;
    }

    if (
      isAuthenticating ||
      isCheckingStorage ||
      isCheckingCallback
    ) {
      return (
        <Layout
          title="Loading..."
          appColor="light"
        >
          <Box
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <ActivityIndicator />
            <StatusBar barStyle="default" />
          </Box>
        </Layout>
      );
    }

    return <Redirect to="auth" />;
  }
}

export default props => (
  <KeycloakConsumer>
    {keycloak => (
      <Loading {...props} keycloak={keycloak} />
    )}
  </KeycloakConsumer>
);
