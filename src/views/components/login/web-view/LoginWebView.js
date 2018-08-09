import React, { Component } from 'react';
import { object } from 'prop-types';
import config from '../../../../config';
import { isObject } from '../../../../utils';
import { WebView, KeycloakConsumer } from '../../index';

class LoginWebView extends Component {
  static propTypes = {
    keycloak: object,
  }

  static getDerivedStateFromProps( props, state ) {
    if (
      props.loginUrl != null &&
      props.loginUrl !== state.loginUrl
    ) {
      return { loginUrl: props.loginUrl };
    }

    return null;
  }

  state = {
    height: 0,
    loginUrl: this.props.keycloak.createLoginUrl().getUrl(),
  }

  handleMessage = message => {
    if ( isObject( message, { withProperty: 'htmlHeight' }))
      this.setState({ height: message.htmlHeight });
  }

  render() {
    return (
      <KeycloakConsumer>
        {({ handleUrlDecoding }) => (
          <WebView
            source={{ uri: this.state.loginUrl }}
            onNavigationStateChange={event => {
              if ( event.url.startsWith( config.keycloak.redirectUri ))
                handleUrlDecoding( event.url );
            }}
            onMessage={this.handleMessage}
            style={{
              flex: 1,
              minHeight: this.state.height,
            }}
          />
        )}
      </KeycloakConsumer>
    );
  }
}

export default LoginWebView;
