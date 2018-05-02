import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import App from './views/app';
import { LayoutProvider } from './views/layout';
import { store } from './redux';

const Root = () => (
  <ReduxProvider store={store}>
    <LayoutProvider>
      <App />
    </LayoutProvider>
  </ReduxProvider>
);

export default Root;
