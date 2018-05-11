import React from 'react';
import { Image as NativeImage } from 'react-native';
import { Box, Icon } from '../../components';
import { string } from 'prop-types';

const Image = ({
  width,
  height,
  source,
}) => {
  if (
    source &&
    typeof source === 'string' &&
    source.length > 0
  ) {
    return (
      <NativeImage
        source={source}
        style={{ width, height }}
      />
    );
  }
  else {
    return (
      <Box
        width={width}
        height={height}
        backgroundColor='gray'
        justifyContent='center'
        alignItems='center'
      >
        <Icon
          name='photo'
          color='white'
          size='lg'
        />
      </Box>
    );
  }
};

Image.propTypes = {
  width: string,
  height: string,
  source: string,
};

export default Image;
