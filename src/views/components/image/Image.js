import React from 'react';
import { Image as NativeImage } from 'react-native';
import { string, oneOf } from 'prop-types';
import { Box, Icon } from '../../components';

const Image = ({
  width,
  height,
  source,
  shape,
}) => {
  const borderRadius = {
    square: 0,
    rounded: 5,
    circle: '50%',
  };
  
  if (
    source &&
    typeof source === 'string' &&
    source.length > 0
  ) {
    return (
      <NativeImage
        source={source}
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
    >
      <Icon
        name="photo"
        color="white"
        size="lg"
      />
    </Box>
  );
};

Image.propTypes = {
  width: string,
  height: string,
  source: string,
  shape: oneOf(
    ['square', 'rounded', 'circle']
  ),
};

export default Image;
