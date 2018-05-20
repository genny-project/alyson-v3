import React, { Component } from 'react';
import { object } from 'prop-types';
import { Platform } from 'react-native';
import { Link, Box, Button, KeycloakConsumer, Redirect } from '../../components';
import Layout from '../../layout';

class Splash extends Component {
  static propTypes = {
    location: object,
  };

  static navigationOptions = {
    title: 'Splash',
    drawerLabel: 'Splash',
  }

  render() {
    let redirectURL = null ;

    if ( Platform.OS === 'web' ) {
      redirectURL = this.props.location.search.startsWith( '?redirectURL=/' ) ? this.props.location.search.split( '?redirectURL=/' )[1] : null;
    }

    return (
      <KeycloakConsumer>
        {({ isAuthenticated }) => isAuthenticated ? (
          <Redirect to={redirectURL ? redirectURL : 'home'} removeRedirectURL />
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
