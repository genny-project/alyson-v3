import React from 'react';
import { any , number, oneOfType, string } from 'prop-types';
import { Box } from '../../components';

const Collection = ({
  children,
  width,
  ...restProps
}) => {
  return (
    <Box
      {...restProps}
      width={width}
    >
      {children}
    </Box>
  );
};

Collection.propTypes = {
  children: any,
  width: oneOfType(
    [string, number]
  ),
};

export default Collection;
