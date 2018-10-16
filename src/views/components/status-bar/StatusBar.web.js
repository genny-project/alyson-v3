import React from 'react';
import { any } from 'prop-types';
import { Box } from '../index';

/* Mock the component. */
const StatusBar = ({ children }) => (
  <Box testID="status-bar">
    {children}
  </Box>
);

StatusBar.propTypes = {
  children: any,
};

export default StatusBar;
