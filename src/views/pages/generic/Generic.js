import React, { Component } from 'react';
import { Platform } from 'react-native';
import { object } from 'prop-types';
import { location } from '../../../utils';
import { LayoutLoader, Redirect, KeycloakConsumer } from '../../components';
import LayoutFetcher from './LayoutFetcher';

class Generic extends Component {
  static propTypes = {
    navigation: object,
    keycloak: object,
  }

  render() {
    const currentUrl = Platform.OS === 'web'
      ? `/${location.getBasePath()}`
      : `/${this.props.navigation.state.params.layout}`;

    if ( !this.props.keycloak.isAuthenticated )
      return <Redirect to={`auth?redirectURL=${currentUrl}`} />;

    return (
      <LayoutFetcher currentUrl={currentUrl}>
        {layout => (
          <LayoutLoader
            layout={layout}
          />
        )}
      </LayoutFetcher>
    );
  }
}

export { Generic };

export default props => (
  <KeycloakConsumer>
    {keycloak => <Generic {...props} keycloak={keycloak} />}
  </KeycloakConsumer>
);
