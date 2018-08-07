import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { LayoutLoader, KeycloakConsumer, Redirect, LayoutFetcher } from '../../components';

class Splash extends Component {
  render() {
    return (
      <KeycloakConsumer>
        {({ isAuthenticated }) => (
          <SafeAreaView style={{ flex: 1 }}>
            {isAuthenticated ? (
              <Redirect
                to="app"
                removeRedirectURL
                useMainNavigator
                appTo="home"
              />
            ) : (
              <LayoutFetcher currentUrl="splash">
                {layout => (
                  <LayoutLoader
                    layout={layout}
                  />
                )}
              </LayoutFetcher>
            )}
          </SafeAreaView>
        )}
      </KeycloakConsumer>
    );
  }
}

export default Splash;
