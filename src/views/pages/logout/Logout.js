import React, { Component } from 'react';
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

  doLogout() {
    this.props.keycloak.attemptLogout({ replaceUrl: true });
  }

  render() {
    const { isAuthenticated, error } = this.props.keycloak;

    if ( !isAuthenticated )
      return <Redirect to="auth" />;

    if ( error )
      return <Text>An error has occurred!</Text>;

    return (
      <Layout
        title="Logout"
        appColor="light"
      >
        <Box
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Text>Logging you out...</Text>
        </Box>
      </Layout>
    );
  }
}

export default props => (
  <KeycloakConsumer>
    {keycloak => (
      <Logout {...props} keycloak={keycloak} />
    )}
  </KeycloakConsumer>
);
