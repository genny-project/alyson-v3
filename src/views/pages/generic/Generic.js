import React, { Component } from 'react';
import { object } from 'prop-types';
import queryString from 'query-string';
import { location } from '../../../utils';
import { LayoutLoader, LayoutFetcher, KeycloakConsumer, Redirect } from '../../components';

class Generic extends Component {
  static propTypes = {
    keycloak: object,
  }

  render() {
    const { isAuthenticated } = this.props.keycloak;
    const currentUrl = location.getBasePath();
    const { redirectUri } = location.getQueryParams();

    const loginUrl = `login?${queryString.stringify({
      redirectUri: redirectUri || `/${currentUrl}`,
    })}`;

    // console.warn({ loginUrl, redirectUri, currentUrl, isAuthenticated });

    return (
      <LayoutFetcher currentUrl={currentUrl}>
        {layout => ( layout && !isAuthenticated ) ? (
          layout.isPublic
            ? (
              <LayoutLoader
                layout={layout}
              />
            )
            : (
              <Redirect
                to={loginUrl}
                useMainNavigator
              />
            )
        ) : (
          <LayoutLoader
            layout={layout}
          />
        )}
      </LayoutFetcher>
    );
  }
}

export { Generic };

export default (
  props => (
    <KeycloakConsumer>
      {keycloak => (
        <Generic
          {...props}
          keycloak={keycloak}
        />
      )}
    </KeycloakConsumer>
  )
);
