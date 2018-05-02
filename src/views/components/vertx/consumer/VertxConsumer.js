import React from 'react';
import VertxContext from '../context';

export default props => (
  <VertxContext.Consumer {...props} />
);
