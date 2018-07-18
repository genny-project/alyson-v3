import React, { Component } from 'react';
import { object } from 'prop-types';
import { Platform, Modal, SafeAreaView } from 'react-native';
import config from '../../../config';
import { Button, Box, KeycloakConsumer, Redirect, Heading, WebView, Icon, Touchable } from '../../components';
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
    // console.warn({ event });

    if ( event.url.startsWith( config.keycloak.redirectUri )) {
      const { keycloak } = this.props;

      this.setState({ showLoginScreen: false });

      keycloak.handleUrlDecoding( event.url );
    }
  }

  handleShowLoginScreen = () => {
    this.setState({ showLoginScreen: true });
  }

  handleHideLoginScreen = () => {
    this.setState({ showLoginScreen: false });
  }

  render() {
    const { location, keycloak } = this.props;
    const { showLoginScreen } = this.state;

    const redirectURL = (
      Platform.OS === 'web' &&
      location.search.startsWith( '?redirectURL=/' )
    )
      ? location.search.split( '?redirectURL=/' )[1]
      : 'app';

    const loginUrl = keycloak.createLoginUrl({
      redirectUri: config.keycloak.redirectUri,
    });

    return (
      <SafeAreaView style={{ flex: 1 }}>
        {keycloak.isAuthenticated ? (
          <Redirect
            to={redirectURL}
            removeRedirectURL
            useMainNavigator
            appTo="home"
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
              <Box
                marginBottom={40}
                justifyContent="center"
              >
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
                  backgroundColor="white"
                  padding={15}
                  paddingLeft={25}
                  position="relative"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Heading>
                    Login
                  </Heading>

                  <Touchable
                    withFeedback
                    onPress={this.handleHideLoginScreen}
                  >
                    <Icon
                      name="close"
                      size="md"
                      color="grey"
                    />
                  </Touchable>
                </Box>

                <Box
                  flex={1}
                  borderTopWidth={2}
                  borderTopColor="grey"
                  borderTopStyle="solid"
                >
                  <WebView
                    source={{ uri: loginUrl.url }}
                    onNavigationStateChange={this.handleNavigationStateChange}
                    style={{ flex: 1 }}
                  />
                </Box>
              </SafeAreaView>
            </Modal>
          </Layout>
        )}
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
