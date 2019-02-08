/* eslint-disable import/first */
import 'nprogress/nprogress.css';
import './polyfills';
import React, { Component } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import App from './views/app';
import { LayoutProvider } from './views/layout';
import { VertxProvider, GoogleProvider, ErrorBoundary, ThemeProvider } from './views/components';
import { store } from './redux';
import './utils/layouts-dev';

console.disableYellowBox = true; // eslint-disable-line no-console

// // /* --- ADDED FOR LOCAL LAYOUT DEV --- */
if ( !this.f ) {
  this.f = true;
  global.LayoutsDev.load( 'internmatch-new' );
}
// /* ------------------------ */

class Root extends Component {
  componentDidMount() {
    this.attachStoreToWindow();
  }

  componentDidUpdate() {
    this.attachStoreToWindow();
  }

  attachStoreToWindow() {
    const storeFromRedux = store.getState();

    return ( window.storeFromRedux = storeFromRedux );
  }

  render() {
    return (
      <ErrorBoundary>
        <ReduxProvider store={store}>
          <VertxProvider>
            <ThemeProvider>
              <LayoutProvider>
                <GoogleProvider>
                  <App />
                </GoogleProvider>
              </LayoutProvider>
            </ThemeProvider>
          </VertxProvider>
        </ReduxProvider>
      </ErrorBoundary>
    );
  }
}

export default Root;
