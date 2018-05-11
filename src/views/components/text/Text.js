import React from 'react';
import { Text as NativeText } from 'react-native';
import { string, number, oneOf, oneOfType } from 'prop-types';
import styles from './Text.style';

const textSizes = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
  xxl: 32,
};

const Text = ({
  children,
  color = 'black',
  decoration = 'none',
  fontWeight,
  height,
  size = 'sm',
  align,
  ...restProps
}) => {
  const style = {
    textDecorationLine: decoration,
    fontWeight,
    height,
    fontSize: textSizes[size],
    textAlign: align,
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
  align: oneOf(
    ['auto', 'left', 'right', 'center', 'justify']
  ),
};

export default Text;
