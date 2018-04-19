import React, { Component } from 'react';
import { object } from 'prop-types';
import { Text, Box, KeycloakConsumer, Redirect } from '../../components';
import Layout from '../../layout';

class Register extends Component {
  static propTypes = {
    keycloak: object,
  }

  componentDidMount() {
    this.doRegister();
  }

  doRegister() {
    this.props.keycloak.attemptRegister({ replaceUrl: true });
  }

  render() {
    const { isAuthenticated, error } = this.props.keycloak;

    if ( isAuthenticated )
      return <Redirect to="home" />;

    if ( error )
      return <Text>{error}</Text>;

    return (
      <Layout title="Register">
        <Box justifyContent="center" alignItems="center" height="100%">
          <Text>Preparing to register...</Text>
        </Box>
      </Layout>
    );
  }
}

export default props => (
  <KeycloakConsumer>
    {keycloak => (
      <Register {...props} keycloak={keycloak} />
    )}
  </KeycloakConsumer>
);
