import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { object } from 'prop-types';
import { Text, Box, KeycloakConsumer, Redirect } from '../../components';
import Layout from '../../layout';

class Logout extends Component {
  static propTypes = {
    keycloak: object,
  }

  componentDidMount() {
    this.doLogout();
  }

  doLogout = () => {
    const { attemptLogout } = this.props.keycloak;

    attemptLogout({ replaceUrl: true });
  }

  render() {
    const { isAuthenticated, error } = this.props.keycloak;

    if ( !isAuthenticated )
      return <Redirect to="auth" />;

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
