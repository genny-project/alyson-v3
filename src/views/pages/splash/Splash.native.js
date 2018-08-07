import React, { Component } from 'react';
import { object } from 'prop-types';
import { Platform, SafeAreaView } from 'react-native';
import { LayoutLoader, KeycloakConsumer, Redirect, LayoutFetcher } from '../../components';

class Splash extends Component {
  static propTypes = {
    location: object,
    keycloak: object,
  }

  render() {
    const { location, keycloak } = this.props;

    const redirectURL = (
      Platform.OS === 'web' &&
      location.search.startsWith( '?redirectURL=/' )
    )
      ? location.search.split( '?redirectURL=/' )[1]
      : 'app';

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
          <LayoutFetcher currentUrl="splash">
            {layout => (
              <LayoutLoader
                layout={layout}
              />
            )}
          </LayoutFetcher>
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
