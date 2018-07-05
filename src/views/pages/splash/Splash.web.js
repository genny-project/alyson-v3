import React, { Component } from 'react';
import { object } from 'prop-types';
import { Platform } from 'react-native';
import { LinkButton, Box, KeycloakConsumer, Redirect, Heading } from '../../components';
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
          <Redirect
            to={redirectURL}
            removeRedirectURL
          />
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
              padding={20}
            >
              <Box marginBottom={40}>
                <Heading
                  size="lg"
                  align="center"
                >
                  Welcome!
                </Heading>
              </Box>

              <LinkButton
                to="login"
                color="red"
              >
                Login
              </LinkButton>
            </Box>
          </Layout>
        )}
      </KeycloakConsumer>
    );
  }
}

export default Splash;
