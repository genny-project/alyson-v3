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
    const currentUrl = location.getBasePath();

    /* If the user isn't authenticated and we can't find a layout to give to them,
     * that means that they are attempting to access a route that either doesn't
     * exist or is not a public layout. In either case, we want to redirect them to the
    * splash screen so they can register and login. */
    if ( !isAuthenticated && !layout ) {
      return (
        <Redirect
          to="splash"
          useMainNavigator
        />
      );
    }

    /* If the layout is not public and the user is not logged in, get them to login
     * or register. Afterwards, we should send them to the redirect URI specified here,
     * which should be the route they were originally trying to access. */
    if ( !isAuthenticated && layout && !layout.isPublic ) {
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
