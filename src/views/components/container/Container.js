import React from 'react';
import { any, string, bool } from 'prop-types';
import Box from '../box';

const Container = ({
  children,
  size = 'sm',
  fullWidth = false,
  ...restProps
}) => {
  const containerWidth = {
    sm: 800,
    md: 1000,
    lg: 1200,
  };

  return (
    <Box
      {...restProps}
      maxWidth={fullWidth ? '100%' : containerWidth[size]}
      width="100%"
      marginX="auto"
      cleanStyleObject
      testID="container"
    >
      {children}
    </Box>
  );
};

Container.propTypes = {
  children: any,
  size: string,
  fullWidth: bool,
};

export default Container;
