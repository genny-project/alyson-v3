import React from 'react';
import GoogleContext from '../context';

export default props => (
  <GoogleContext.Consumer {...props} />
);
