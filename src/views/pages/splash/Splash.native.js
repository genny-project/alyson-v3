import React, { Component } from 'react';
import { object } from 'prop-types';
import { Platform, Modal, SafeAreaView } from 'react-native';
import config from '../../../config';
import { Button, Box, KeycloakConsumer, Redirect, Heading, WebView } from '../../components';
import Layout from '../../layout';

class Splash extends Component {
  static propTypes = {
    location: object,
    keycloak: object,
  }

  state = {
    showLoginScreen: false,
  }

  handleNavigationStateChange = event => {
    console.warn({ event });

    if ( event.url.startsWith( config.keycloak.redirectUri )) {
      const { keycloak } = this.props;

      this.setState({ showLoginScreen: false });

      keycloak.handleUrlDecoding( event.url );
    }
  }

  handleShowLoginScreen = () => {
    this.setState({ showLoginScreen: true });
  }

  render() {
    const { location, keycloak } = this.props;
    const { showLoginScreen } = this.state;

    const redirectURL = (
      Platform.OS === 'web' &&
      location.search.startsWith( '?redirectURL=/' )
    )
      ? location.search.split( '?redirectURL=/' )[1]
      : 'home';

    const loginUrl = keycloak.createLoginUrl({
      redirectUri: config.keycloak.redirectUri,
    });

    return (
      <SafeAreaView style={{ flex: 1 }}>
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

                <Button
                  color="red"
                  onPress={this.handleShowLoginScreen}
                >
                  Login
                </Button>
              </Box>

              <Modal
                visible={showLoginScreen}
                animationType="slide"
              >
                <SafeAreaView style={{ flex: 1 }}>
                  <Box
                    flex={1}
                    borderWidth={2}
                    borderColor="grey"
                    borderStyle="solid"
                  >
                    <WebView
                      source={{ uri: loginUrl.url }}
                      onMessage={this.handleMessage}
                      ref={webview => this.webview = webview}
                      onNavigationStateChange={this.handleNavigationStateChange}
                      style={{ flex: 1 }}
                    />
                  </Box>
                </SafeAreaView>
              </Modal>
            </Layout>
          )}
        </KeycloakConsumer>
      </SafeAreaView>
    );
  }
}

export default props => (
  <KeycloakConsumer>
    {keycloak => (
      <Splash
        {...props}
        keycloak={keycloak}
      />
    )}
  </KeycloakConsumer>
);
