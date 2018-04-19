import React, { Component } from 'react';
import { object } from 'prop-types';
import { ActivityIndicator, StatusBar } from 'react-native';
import { KeycloakConsumer, Redirect } from '../../components';
import Layout from '../../layout';

class Loading extends Component {
  static propTypes = {
    keycloak: object,
  }

  render() {
    const { isAuthenticated, isAuthenticating, isCheckingStorage, isCheckingCallback } = this.props.keycloak;

    if ( isAuthenticated ) {
      return <Redirect to="app" replace />;
    }

    if (
      isAuthenticating ||
      isCheckingStorage ||
      isCheckingCallback
    ) {
      return (
        <Layout title="Loading...">
          <ActivityIndicator />
          <StatusBar barStyle="default" />
        </Layout>
      );
    }

    return <Redirect to="auth" replace />;
  }
}

export default props => (
  <KeycloakConsumer>
    {keycloak => (
      <Loading {...props} keycloak={keycloak} />
    )}
  </KeycloakConsumer>
);
