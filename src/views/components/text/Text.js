import React from 'react';
import { Text as NativeText } from 'react-native';
import { string, number, oneOf, oneOfType } from 'prop-types';
import styles from './Text.style';

const Text = ({
  children,
  color = 'black',
  decoration = 'none',
  fontWeight,
  height,
  size = 'sm',
  ...restProps
}) => {
  const textSizes = {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24,
    xxl: 32,
  };

  const style = {
    textDecorationLine: decoration,
    fontWeight,
    height,
    fontSize: textSizes[size],
  };

  return (
    <NativeText
      {...restProps}
      style={[
        styles[color],
        style,
      ]}
    >
      {children}
    </NativeText>
  );
};

Text.propTypes = {
  color: oneOf(
    ['white', 'black', 'red', 'blue', 'green']
  ),
  decoration: oneOf(
    ['none']
  ),
  margin: number,
  marginX: number,
  marginY: number,
  marginTop: number,
  marginRight: number,
  marginBottom: number,
  marginLeft: number,
  fontWeight: string,
  size: string,
  height: oneOfType(
    [number, string]
  ),
  children: oneOfType(
    [number, string]
  ),
};

export default Text;
