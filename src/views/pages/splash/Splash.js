import React, { Component } from 'react';
import { object } from 'prop-types';
import { Text, Link, Button, Redirect, Box, KeycloakConsumer, ScrollView } from '../../components';
import Layout from '../../layout';
import * as page from '../../../utils/page';

class Splash extends Component {
  static propTypes = {
    keycloak: object,
  }

  static navigationOptions = {
    title: 'Splash',
    drawerLabel: 'Splash',
  }

  state = {
    isRefreshing: false,
  }

  handleRefresh = () => {
    page.refresh();
  }

  render() {
    const { isAuthenticated } = this.props.keycloak;
    const { isRefreshing } = this.state;

    if ( isAuthenticated )
      return <Redirect to="app" />;

    return (
      <Layout title="Splash">
        <Box flex={1}>
          <ScrollView
            enableRefresh
            onRefresh={this.handleRefresh}
            isRefreshing={isRefreshing}
            flex={1}
            width="100%"
          >
            <Box
              justifyContent="center"
              alignItems="center"
              flex={1}
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
          </ScrollView>
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
