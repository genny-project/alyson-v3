import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import App from './views/app';
import { LayoutProvider } from './views/layout';
import { VertxProvider, GoogleProvider, ErrorBoundary } from './views/components';
import { store } from './redux';

const Root = () => (
  <ErrorBoundary>
    <ReduxProvider store={store}>
      <VertxProvider>
        <LayoutProvider>
          <GoogleProvider>
            <App />
          </GoogleProvider>
        </LayoutProvider>
      </VertxProvider>
    </ReduxProvider>
  </ErrorBoundary>
);

export default Root;
