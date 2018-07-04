import React from 'react';
import { Image as NativeImage } from 'react-native';
import { string, oneOf, oneOfType, number } from 'prop-types';
import { Box, Icon } from '../';

const Image = ({
  width,
  height,
  source,
  shape,
  fallbackIcon = 'photo',
  fallbackIconSize = 'lg',
  fallbackColor = 'gray',
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
      <NativeImage
        source={{ uri: source }}
        style={{ width, height, borderRadius: borderRadius[shape] }}
      />
    );
  }

  return (
    <Box
      width={width}
      height={height}
      backgroundColor={fallbackColor}
      justifyContent="center"
      alignItems="center"
      borderRadius={borderRadius[shape]}
    >
      <Icon
        name={fallbackIcon}
        color="white"
        size={fallbackIconSize}
      />
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
  shape: oneOf(
    ['square', 'rounded', 'circle']
  ),
  fallbackIcon: string,
  fallbackIconSize: string,
  fallbackColor: string,
};

export default Image;
