import React from 'react';
import { any, string } from 'prop-types';
import Box from '../box';

const Container = ({
  children,
  size = 'sm',
}) => {
  const containerWidth = {
    sm: 800,
    md: 1000,
    lg: 1200,
  };

  return (
    <Box
      justifyContent="center"
      width="100%"
    >
      <Box
        maxWidth={containerWidth[size]}
        justifyContent="center"
        width="100%"
      >
        {children}
      </Box>
    </Box>
  );
};

Container.propTypes = {
  children: any,
  size: string,
};

export default Container;
