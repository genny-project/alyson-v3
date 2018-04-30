import React from 'react';
import { string, oneOf } from 'prop-types';
import range from 'lodash.range';
import Text from '../text';

const Heading = ({
  children,
  color = 'black',
  decoration = 'none',
  margin,
  marginX,
  marginY,
  fontWeight = 'bold',
  size = 'md',
}) => {
  return (
    <Text
      color={color}
      decoration={decoration}
      margin={margin}
      marginX={marginX}
      marginY={marginY}
      fontWeight={fontWeight}
      size={size}
    >
      {children}
    </Text>
  );
};

const marginPropType = range( 0, 12 );

Heading.propTypes = {
  children: string,
  color: oneOf(
    ['white', 'black', 'red', 'blue', 'green']
  ),
  decoration: oneOf(
    ['none']
  ),
  margin: oneOf( marginPropType ),
  marginX: oneOf( marginPropType ),
  marginY: oneOf( marginPropType ),
  fontWeight: string,
  size: string,
};

export default Heading;
