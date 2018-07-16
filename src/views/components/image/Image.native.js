import React from 'react';
import { Image as NativeImage, Dimensions } from 'react-native';
import { string, oneOf, oneOfType, number, array } from 'prop-types';
import { Box, Icon } from '../';

const Image = ({
  width,
  height,
  source,
  shape,
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
      const { width, height } = Dimensions.get( 'window' );
     
      return (
        <Box>
          <NativeImage 
            source={{ uri: source }}
            style={{ width, height, borderRadius: borderRadius[shape] }}
          />
          <Box 
            position="absolute" 
            width={width} 
            height={height}
            top={0}
            left={0}
          >
            {children}
          </Box>
        </Box>
      );
    }
    
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
  children: array,
  shape: oneOf(
    ['square', 'rounded', 'circle']
  ),
  fallbackIcon: string,
  fallbackIconSize: string,
  fallbackColor: string,
};

export default Image;
