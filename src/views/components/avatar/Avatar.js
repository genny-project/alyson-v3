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
    sm: 24,
    md: 40,
    lg: 72,
  };

  const onlineColor = {
    online: 'green',
    offline: 'grey',
  };
  
  return (
    <Box
      width={sizes[size] || '100%'}
      height={sizes[size] || '100%'}
      backgroundColor="gray"
      justifyContent="center"
      alignItems="center"
      borderRadius="50%"
      borderStyle={outline && 'solid'}
      borderWidth={outline && 2}
      borderColor={outline && 'white'}
      position="relative"
    >
      {(
        src &&
        typeof src === 'string' &&
        src.length > 0
      ) ? (
        <Image
          source={src}
          shape="circle"
          width={sizes[size] || '100%'}
          height={sizes[size] || '100%'}
        />
        ) : (
          <Text
            color="white"
            size="lg"
          >
            {name && name.substr( 0 )}
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
            borderRadius="50%"
            position="absolute"
            bottom={sizes[size] / 4}
            right={sizes[size] / 4}
            borderStyle="solid"
            borderWidth={1}
            borderColor="white"
            backgroundColor={onlineColor[showOnline]}
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
