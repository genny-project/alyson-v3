import React from 'react';
import { string, oneOf, oneOfType, number, any } from 'prop-types';
import { Box, Icon } from '../../components';

const Image = ({
  width,
  height,
  source,
  shape,
  children,
  testID = 'image',
}) => {
  const borderRadius = {
    square: 0,
    rounded: 5,
    circle: width / 2,
  };

  if (
    source &&
    typeof source === 'string' &&
    source.length > 0 &&
    source !== 'undefined'
  ) {
    return (
      <img
        testID={testID}
        src={source}
        style={{ width, height, borderRadius: borderRadius[shape] }}
      />
    );
  }

  return (
    <Box
      width={width}
      height={height}
      backgroundColor="gray"
      justifyContent="center"
      alignItems="center"
      borderRadius={borderRadius[shape]}
      testID={testID}
    >
      <Icon
        name="photo"
        color="white"
        size="lg"
      />

      {children}
    </Box>
  );
};

Image.propTypes = {
  width: oneOfType(
    [string, number]
  ),
  height: oneOfType(
    [string, number]
  ),
  source: string,
  children: any,
  shape: oneOf(
    ['square', 'rounded', 'circle']
  ),
  testID: string,
};

export default Image;
