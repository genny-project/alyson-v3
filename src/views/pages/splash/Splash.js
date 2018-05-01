import React, { Component } from 'react';
import { object } from 'prop-types';
import { Link, Button, Redirect, Box, KeycloakConsumer } from '../../components';
import Layout from '../../layout';

class Splash extends Component {
  static propTypes = {
    keycloak: object,
  }

  static navigationOptions = {
    title: 'Splash',
    drawerLabel: 'Splash',
  }

  render() {
    const { isAuthenticated } = this.props.keycloak;

    if ( isAuthenticated )
      return <Redirect to="app" />;

    return (
      <Layout
        title="Splash"
        appColor="light"
        hideHeader
      >
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
          flexDirection="column"
        >
          <Link to="login">
            <Button color="green">
              Login
            </Button>
          </Link>

          <Link to="register">
            <Button color="white">
              Register
            </Button>
          </Link>
        </Box>
      </Layout>
    );
  }
}

export default props => (
  <KeycloakConsumer>
    {keycloak => (
      <Splash {...props} keycloak={keycloak} />
    )}
  </KeycloakConsumer>
);
