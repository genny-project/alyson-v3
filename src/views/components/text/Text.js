import React from 'react';
import { Text as NativeText } from 'react-native';
import { string, oneOf } from 'prop-types';
import range from 'lodash.range';
import styles from './Text.style';

const Text = ({
  children,
  color = 'black',
  decoration = 'none',
  margin,
  marginX,
  marginY = 0,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  fontWeight,
  size = 'sm',
  ...restProps
}) => {
  return (
    <NativeText
      {...restProps}
      style={[
        styles[color],
        styles[size],
        {
          textDecorationLine: decoration,
          margin,
          marginHorizontal: marginX,
          marginVertical: marginY,
          marginTop,
          marginRight,
          marginBottom,
          marginLeft,
          fontWeight,
        },
      ]}
    >
      {children}
    </NativeText>
  );
};

const marginPropType = range( 0, 12 );

Text.propTypes = {
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
  marginTop: oneOf( marginPropType ),
  marginRight: oneOf( marginPropType ),
  marginBottom: oneOf( marginPropType ),
  marginLeft: oneOf( marginPropType ),
  fontWeight: string,
  size: string,
};

export default Text;
