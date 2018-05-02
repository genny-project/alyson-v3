import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import App from './views/app';
import { LayoutProvider } from './views/layout';
import { VertxProvider } from './views/components';
import { store } from './redux';

const Root = () => (
  <ReduxProvider store={store}>
    <VertxProvider>
      <LayoutProvider>
        <App />
      </LayoutProvider>
    </VertxProvider>
  </ReduxProvider>
);

export default Root;
