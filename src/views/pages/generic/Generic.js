import React, { Component } from 'react';
import { object } from 'prop-types';
import queryString from 'query-string';
import { location } from '../../../utils';
import { LayoutLoader, LayoutFetcher, KeycloakConsumer, Redirect } from '../../components';

class Generic extends Component {
  static propTypes = {
    keycloak: object,
    layout: object,
  }

  shouldComponentUpdate( nextProps ) {
    const wasAuthenticated = this.props.keycloak.isAuthenticated;
    const { isAuthenticated } = nextProps.keycloak;

    if ( wasAuthenticated !== isAuthenticated )
      return true;

    if ( this.props.layout !== nextProps.layout )
      return true;

    return false;
  }

  render() {
    const { layout } = this.props;
    const { isAuthenticated } = this.props.keycloak;

    if ( !isAuthenticated && layout && !layout.isPublic ) {
      const currentUrl = location.getBasePath();
      const { redirectUri } = location.getQueryParams();

      const loginUrl = `login?${queryString.stringify({
        redirectUri: redirectUri || `/${currentUrl}`,
      })}`;

      return (
        <Redirect
          to={loginUrl}
          useMainNavigator
        />
      );
    }

    return (
      <LayoutLoader
        layout={layout}
      />
    );
  }
}

export { Generic };

export default (
  props => (
    <KeycloakConsumer>
      {keycloak => (
        <LayoutFetcher currentUrl={location.getBasePath()}>
          {layout => (
            <Generic
              {...props}
              keycloak={keycloak}
              layout={layout}
            />
          )}
        </LayoutFetcher>
      )}
    </KeycloakConsumer>
  )
);
