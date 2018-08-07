import React, { Component } from 'react';
import config from '../../../../config';
import { isObject } from '../../../../utils';
import { KeycloakConsumer, WebView } from '../../index';

class LoginWebView extends Component {
  state = {
    height: 0,
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
            source={require( './login.html' )}
            onNavigationStateChange={event => {
              if ( event.url.startsWith( config.keycloak.redirectUri ))
                handleUrlDecoding( event.url );
            }}
            scrollEnabled={false}
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
