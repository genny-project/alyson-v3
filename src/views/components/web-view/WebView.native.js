import React, { Component } from 'react';
import { WebView as NativeWebView } from 'react-native';
import { any, func } from 'prop-types';

// fix https://github.com/facebook/react-native/issues/10865
const patchPostMessageJsCode = `(${String(() => {
  const originalPostMessage = window.postMessage;

  function patchedPostMessage( message, targetOrigin, transfer ) {
    originalPostMessage( message, targetOrigin, transfer );
  }

  patchedPostMessage.toString = function () {
    return String( Object.hasOwnProperty ).replace( 'hasOwnProperty', 'postMessage' );
  };

  window.postMessage = patchedPostMessage;
})})();`;

class WebView extends Component {
  static propTypes = {
    source: any,
    onMessage: func,
  }

  postMessage = action => {
    this.webview.postMessage(
      JSON.stringify( action )
    );
  }

  render() {
    const { source, onMessage, ...props } = this.props;

    return (
      <NativeWebView
        {...props}
        javaScriptEnabled
        injectedJavaScript={patchPostMessageJsCode}
        source={source}
        ref={webview => this.webview = webview}
        onMessage={e => onMessage(
          JSON.parse( e.nativeEvent.data )
        )}
      />
    );
  }
}

export default WebView;
