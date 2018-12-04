import React, { Component } from 'react';
import { object } from 'prop-types';
import { ActivityIndicator } from 'react-native';
import { KeycloakConsumer, Redirect, Box, Text } from '../../components';
import Layout from '../../layout';

class Loading extends Component {
  static propTypes = {
    keycloak: object,
  }

  render() {
    const {
      isAuthenticated,
      isAuthenticating,
      isCheckingStorage,
      isCheckingCallback,
    } = this.props.keycloak;

    if ( isAuthenticated ) {
      return (
        <Redirect
          to="app"
          useAppNavigator={false}
        />
      );
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
            flex={1}
            flexDirection="column"
            testID="page-loading"
          >
            <ActivityIndicator />
            <Text>
              Loading...
            </Text>
          </Box>
        </Layout>
      );
    }

    return (
      <Redirect
        to="auth"
        useAppNavigator={false}
      />
    );
  }
}

export default props => (
  <KeycloakConsumer>
    {keycloak => (
      <Loading
        {...props}
        keycloak={keycloak}
      />
    )}
  </KeycloakConsumer>
);
