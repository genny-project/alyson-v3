import React from 'react';
import ThemeContext from '../context';

export default props => (
  <ThemeContext.Consumer {...props} />
);
