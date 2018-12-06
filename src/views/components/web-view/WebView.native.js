import React, { Component } from 'react';
import { WebView as NativeWebView, Platform } from 'react-native';
import { any, func, bool } from 'prop-types';

// fix https://github.com/facebook/react-native/issues/10865
const patchPostMessageJsCode = `(${String(() => {
  const originalPostMessage = window.postMessage;

  function patchedPostMessage( message, targetOrigin, transfer ) {
    originalPostMessage( message, targetOrigin, transfer );
  }

  patchedPostMessage.toString = function () {
    return String( Object.hasOwnProperty ).replace( 'hasOwnProperty', 'postMessage' );
  };

  var htmlHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );

  window.postMessage = patchedPostMessage;

  window.postMessage(
    JSON.stringify({ htmlHeight })
  );
})})();`;

class WebView extends Component {
  static defaultProps = {
    scalesPageToFit: Platform.OS === 'android',
  }

  static propTypes = {
    source: any,
    onMessage: func,
    scalesPageToFit: bool,
  }

  postMessage = action => {
    this.webview.postMessage(
      JSON.stringify( action )
    );
  }

  handleMessage = event => {
    const { data } = event.nativeEvent;

    try {
      const parsed = JSON.parse( data );

      if ( this.props.onMessage )
        this.props.onMessage( parsed );
    }
    catch ( error ) {
      // eslint-disable-next-line no-console
      console.warn( 'Unable to parse WebView message', { error, data });
    }
  }

  handleRef = ref => {
    this.webview = ref;
  }

  render() {
    const { source, scalesPageToFit, ...props } = this.props;

    return (
      <NativeWebView
        {...props}
        javaScriptEnabled
        injectedJavaScript={patchPostMessageJsCode}
        source={source}
        ref={this.handleRef}
        onMessage={this.handleMessage}
        scalesPageToFit={scalesPageToFit}
      />
    );
  }
}

export default WebView;
