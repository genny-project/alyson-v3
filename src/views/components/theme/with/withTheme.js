import React from 'react';
import ThemeConsumer from '../consumer';

const withTheme = Component => props => (
  <ThemeConsumer>
    {theme => (
      <Component
        {...props}
        theme={theme}
      />
    )}
  </ThemeConsumer>
);

export default withTheme;
