import React, { Component } from 'react';
import { Link, Box, Button, KeycloakConsumer, Redirect } from '../../components';
import Layout from '../../layout';

class Splash extends Component {
  static navigationOptions = {
    title: 'Splash',
    drawerLabel: 'Splash',
  }

  render() {
    return (
      <KeycloakConsumer>
        {({ isAuthenticated }) => isAuthenticated ? (
          <Redirect to="home" />
        ) : (
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
                <Button
                  color="red"
                >
                  Login
                </Button>
              </Link>
            </Box>
          </Layout>
        )}
      </KeycloakConsumer>
    );
  }
}

export default Splash;
