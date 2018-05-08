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
}) => {
  return (
    <Text
      color={color}
      decoration={decoration}
      fontWeight={fontWeight}
      size={size}
      onPress={onPress}
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
  size: string,
  onPress: func,
};

export default Heading;
