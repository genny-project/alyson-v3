import React from 'react';
import LayoutContext from '../context';

export default props => (
  <LayoutContext.Consumer {...props} />
);
