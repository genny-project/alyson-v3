import React from 'react';
import { Text as NativeText } from 'react-native';
import { string, oneOf, number } from 'prop-types';
import styles from './Text.style';

const Text = ({
  children,
  color = 'black',
  decoration = 'none',
  marginVertical = 10,
  marginHorizontal = 0,
  ...restProps
}) => {
  return (
    <NativeText
      {...restProps}
      style={[
        styles[color],
        {
          textDecorationStyle: decoration,
          marginVertical,
          marginHorizontal,
        },
      ]}
    >
      {children}
    </NativeText>
  );
};

Text.propTypes = {
  children: string,
  color: oneOf(
    ['white', 'black', 'red', 'blue', 'green']
  ),
  decoration: oneOf(
    ['none']
  ),
  marginVertical: number,
  marginHorizontal: number,
};

export default Text;
