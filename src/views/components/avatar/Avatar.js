import React from 'react';
import { string, oneOf, bool } from 'prop-types';
import { Box, Image, Text } from '../../components';

const Avatar = ({
  name = 'User',
  outline = false,
  showOnline = false,
  size,
  src,
}) => {
  const sizes = {
    sm: 30,
    md: 60,
    lg: 80,
  };

  const textSizes = {
    sm: 'xs',
    md: 'sm',
    lg: 'xxl',
  };

  const borderSizes = {
    sm: 1,
    md: 1,
    lg: 2,
  };

  const onlineColor = {
    online: 'green',
    offline: 'grey',
  };

  const position = {
    sm: 1,
    md: 1,
    lg: 1,
  };

  return (
    <Box
      width={sizes[size] || '100%'}
      height={sizes[size] || '100%'}
      backgroundColor="gray"
      justifyContent="center"
      alignItems="center"
      shape="circle"
      borderStyle={outline && 'solid'}
      borderWidth={outline && borderSizes[size] || 2}
      borderColor={outline && 'white'}
      position="relative"
      cleanStyleObject
      padding={0}
    >
      {(
        src &&
        typeof src === 'string' &&
        src.length > 0 &&
        typeof src !== 'undefined'
      ) ? (
        <Image
          source={src}
          shape="circle"
          width="100%"
          height="100%"
        />
        ) : (
          <Text
            color="white"
            size={textSizes[size] || 'md'}
          >
            {name && name.substr( 0, 1 )}
          </Text>
        )
      }
      {
        (
          showOnline &&
          typeof showOnline === 'string' &&
          showOnline.length > 0
        ) && 
          ( <Box
            width={sizes[size] / 4}
            height={sizes[size] / 4}
            // maxWidth={15}
            // maxHeight={15}
            borderRadius="50%"
            position="absolute"
            bottom={position[size] || 5}
            right={position[size] || 5}
            borderStyle="solid"
            borderWidth={borderSizes[size] || 2}
            borderColor="white"
            backgroundColor={onlineColor[showOnline]}
            cleanStyleObject
            testID="avatar"
          /> 
          )
      }
    </Box>
  );
};

Avatar.propTypes = {
  name: string,
  outline: bool,
  size: oneOf(
    ['sm', 'md', 'lg']
  ),
  src: string,
  showOnline: oneOf(
    ['online', 'offline'] 
  ),
};

export default Avatar;
