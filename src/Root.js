/* eslint-disable import/first */
import './polyfills';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import App from './views/app';
import { LayoutProvider } from './views/layout';
import { VertxProvider, GoogleProvider, ErrorBoundary, ThemeProvider } from './views/components';
import { store } from './redux';
import './utils/layouts-dev';

console.disableYellowBox = true; // eslint-disable-line no-console

/* --- ADDED FOR 4* DEV --- */
if ( !this.f ) {
  this.f = true;
  global.LayoutsDev.load( 'fourdegrees-new' );
}
/* ------------------------ */

const Root = () => (
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

export default Root;
