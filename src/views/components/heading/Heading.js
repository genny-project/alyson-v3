import React from 'react';
import { string, oneOf, func } from 'prop-types';
import Text from '../text';

const Heading = ({
  children,
  color = 'black',
  decoration = 'none',
  fontWeight = 'bold',
  size = 'md',
  onPress,
  align,
}) => {
  return (
    <Text
      color={color}
      decoration={decoration}
      fontWeight={fontWeight}
      size={size}
      onPress={onPress}
      align={align}
    >
      {children}
    </Text>
  );
};

Heading.propTypes = {
  children: string,
  color: oneOf(
    ['white', 'black', 'red', 'blue', 'green']
  ),
  decoration: oneOf(
    ['none']
  ),
  fontWeight: string,
  size: oneOf(
    ['xs', 'sm', 'md', 'lg', 'xl']
  ),
  onPress: func,
  align: string,
};

export default Heading;
