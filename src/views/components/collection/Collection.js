import React from 'react';
import { any , number, oneOfType, string } from 'prop-types';
import { Box } from '../../components';

const Collection = ({
  children,
  width,
  testID = 'collection',
  ...restProps
}) => {
  return (
    <Box
      {...restProps}
      width={width}
      testID={testID}
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
  testID: string,
};

export default Collection;
