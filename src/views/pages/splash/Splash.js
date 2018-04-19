import React, { Component } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { object } from 'prop-types';
import { Text, Link, Button, Redirect, Box, KeycloakConsumer } from '../../components';
import Layout from '../../layout';
import * as page from '../../../utils/page';

class Splash extends Component {
  static propTypes = {
    keycloak: object,
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
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={this.handleRefresh}
            />
          }
        >
          <Box>
            <Text>Splash</Text>

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
