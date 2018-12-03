import React from 'react';
import { any, string } from 'prop-types';
import { Box } from '../index';

/* Mock the component. */
const StatusBar = ({ children, testID = 'status-bar' }) => (
  <Box testID={testID}>
    {children}
  </Box>
);

StatusBar.propTypes = {
  children: any,
  testID: string,
};

export default StatusBar;
