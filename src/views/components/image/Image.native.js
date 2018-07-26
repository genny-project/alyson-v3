import React from 'react';
import { Image as NativeImage, ImageBackground as NativeImageBackground, Dimensions } from 'react-native';
import { string, oneOf, oneOfType, number, array, bool } from 'prop-types';
import { Box, Icon } from '../';

const Image = ({
  width,
  height,
  source,
  shape,
  fullscreen = false,
  children,
  fallbackIcon = 'photo',
  fallbackIconSize = 'lg',
  fallbackColor = 'gray',
}) => {
  const borderRadius = {
    square: 0,
    rounded: 5,
    circle: width / 2,
  };

  const imageWidth = fullscreen ? Dimensions.get( 'window' ).width : width;
  const imageHeight = fullscreen ? Dimensions.get( 'window' ).height : height;

  if (
    source &&
    typeof source === 'string' &&
    source.length > 0 &&
    source !== 'undefined'
  ) {
    if (
      children &&
      children.length > 0
    ) {
      return (
        <NativeImageBackground 
          source={{ uri: source }}
          style={{ width: imageWidth, height: imageHeight, borderRadius: borderRadius[shape] }}
        >
          <Box 
            position="absolute" 
            top={0}
            left={0}
            width={imageWidth}
            height={imageHeight}
          >
            {children}
          </Box>
        </NativeImageBackground>
      );
    }
    
    return (
      <NativeImage
        source={{ uri: source }}
        style={{ width: imageWidth, height: imageHeight, borderRadius: borderRadius[shape] }}
      />
    );
  }

  return (
    <Box
      width={imageWidth}
      height={imageHeight}
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
  fullscreen: bool,
  children: array,
  shape: oneOf(
    ['square', 'rounded', 'circle']
  ),
  fallbackIcon: string,
  fallbackIconSize: string,
  fallbackColor: string,
};

export default Image;
