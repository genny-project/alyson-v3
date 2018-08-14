import React from 'react';
import { ImageBackground as NativeImage } from 'react-native';
import { string, oneOf, oneOfType, number, array, bool } from 'prop-types';
import { Box, Icon } from '../';
import { isString } from '../../../utils';

const Image = ({
  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  flex,
  source,
  shape,
  fallbackIcon = 'photo',
  fallbackIconSize = 'lg',
  fallbackColor = 'gray',
  ...restProps
}) => {
  const borderRadius = {
    square: 0,
    rounded: 5,
    circle: width / 2,
  };

  if (
    isString( source, { ofMinLength: 1 }) &&
    source !== 'undefined'
  ) {
    return (
      <NativeImage
        {...restProps}
        source={{ uri: source }}
        style={{
          height,
          width,
          minHeight,
          minWidth,
          maxHeight,
          maxWidth,
          flex,
          borderRadius: borderRadius[shape] || Number( borderRadius ),
        }}
      />
    );
  }

  return (
    <Box
      {...restProps}
      flex={flex}
      width={width}
      height={height}
      minWidth={minWidth}
      minHeight={minHeight}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
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
  minWidth: oneOfType(
    [string, number]
  ),
  minHeight: oneOfType(
    [string, number]
  ),
  maxWidth: oneOfType(
    [string, number]
  ),
  maxHeight: oneOfType(
    [string, number]
  ),
  source: string,
  fullscreen: bool,
  children: array,
  shape: oneOf(
    ['square', 'rounded', 'circle']
  ),
  fallbackIcon: string,
  fallbackIconSize: string,
  fallbackColor: string,
  flex: number,
};

export default Image;
