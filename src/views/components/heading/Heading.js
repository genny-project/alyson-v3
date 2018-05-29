import React from 'react';
import { string, oneOf, oneOfType, number, func } from 'prop-types';
import Text from '../text';

const Heading = ({
  children,
  color = 'black',
  decoration = 'none',
  fontWeight = 'bold',
  size = 'md',
  onPress,
  align,
  width,
  ...restProps
}) => {
  return (
    <Text
      {...restProps}
      color={color}
      decoration={decoration}
      fontWeight={fontWeight}
      size={size}
      onPress={onPress}
      align={align}
      width={width}
    >
      {children}
    </Text>
  );
};

Heading.propTypes = {
  children: string,
  color: string,
  decoration: oneOf(
    ['none']
  ),
  fontWeight: string,
  size: oneOf(
    ['xs', 'sm', 'md', 'lg', 'xl']
  ),
  onPress: func,
  align: string,
  width: oneOfType(
    [string, number]
  ),
};

export default Heading;
