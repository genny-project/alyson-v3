import React, { Component } from 'react';
import { object } from 'prop-types';
import { Platform } from 'react-native';
import { Link, Box, Button, KeycloakConsumer, Redirect } from '../../components';
import Layout from '../../layout';

class Splash extends Component {
  static propTypes = {
    location: object,
  }

  render() {
    const { location } = this.props;
    
    const redirectURL = (
      Platform.OS === 'web' &&
      location.search.startsWith( '?redirectURL=/' )
    )
      ? location.search.split( '?redirectURL=/' )[1]
      : 'home';

    return (
      <KeycloakConsumer>
        {({ isAuthenticated }) => isAuthenticated ? (
          <Redirect to={redirectURL} removeRedirectURL />
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
