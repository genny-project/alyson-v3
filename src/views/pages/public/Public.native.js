import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { object } from 'prop-types';
import { LayoutLoader, KeycloakConsumer, Redirect, LayoutFetcher } from '../../components';

class Public extends Component {
  static propTypes = {
    navigation: object,
  }

  render() {
    const layoutName = this.props.navigation.getParam( 'layout' );

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
              <LayoutFetcher currentUrl={layoutName}>
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

export default withNavigation( Public );
