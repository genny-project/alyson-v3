import React, { Component } from 'react';
import { object } from 'prop-types';
import { KeycloakConsumer, Redirect, LayoutFetcher, LayoutLoader } from '../../components';

class Splash extends Component {
  static propTypes = {
    location: object,
  }

  render() {
    const { location } = this.props;

    const redirectURL = location.search.startsWith( '?redirectURL=/' )
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
          <LayoutFetcher currentUrl="splash">
            {layout => (
              <LayoutLoader
                layout={layout}
              />
            )}
          </LayoutFetcher>
        )}
      </KeycloakConsumer>
    );
  }
}

export default Splash;
