import React, { Component } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { Text, Link, Button, Redirect, Box, KeycloakConsumer } from '../../components';
import Layout from '../../layout';
import * as page from '../../../utils/page';

class Splash extends Component {
  state = {
    isRefreshing: false,
  }

  handleRefresh = () => {
    page.refresh();
  }

  render() {
    const { isAuthenticated } = this.props.keycloak;
    const { isRefreshing } = this.state;

    console.log( this.props );

    if ( isAuthenticated )
      return <Redirect to="home" />;

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
