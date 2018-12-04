import React from 'react';
import { string, oneOf, oneOfType, number, func, bool } from 'prop-types';
import Text from '../text';

const Heading = ({
  children,
  color = 'black',
  decoration = 'none',
  size = 'md',
  onPress,
  align,
  width,
  bold = true,
  testID = 'heading',
  ...restProps
}) => {
  return (
    <Text
      {...restProps}
      color={color}
      decoration={decoration}
      bold={bold}
      size={size}
      onPress={onPress}
      align={align}
      width={width}
      testID={testID}
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
  bold: bool,
  size: oneOf(
    ['xs', 'sm', 'md', 'lg', 'xl']
  ),
  onPress: func,
  align: string,
  width: oneOfType(
    [string, number]
  ),
  testID: string,
};

export default Heading;
