import React from 'react';
import { Text as NativeText, Platform } from 'react-native';
import { string, number, oneOf, oneOfType, bool, node } from 'prop-types';
import capitalize from 'lodash.capitalize';
import upperCase from 'lodash.uppercase';
import lowerCase from 'lodash.lowercase';

const textSizes = {
  xxs: 12,
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
  xxl: 32,
};

const colors = {
  black: 'black',
  green: 'green',
  red: 'red',
  blue: 'blue',
  white: 'white',
  transparent: 'transparent',
};

const transforms = {
  upperCase: text => upperCase( text ),
  lowerCase: text => lowerCase( text ),
  capitalize: text => capitalize( text ),
};

const Text = ({
  children,
  color = 'black',
  decoration = 'none',
  fontWeight,
  height,
  size = 'sm',
  align,
  width,
  bold,
  fontFamily,
  text,
  transform,
  ...restProps
}) => {
  const style = {
    textDecorationLine: decoration,
    fontWeight: bold ? 'bold' : fontWeight,
    height,
    fontSize: textSizes[size],
    textAlign: align,
    width,
    color: colors[color] || color,
    fontFamily: fontFamily || Platform.select({
      web: 'system-ui, sans-serif',
      native: 'System',
    }),
  };

  let child = text || children;

  if (
    transform &&
    transforms[transform]
  ) {
    child = transforms[transform]( child );
  }

  return (
    <NativeText
      {...restProps}
      style={[
        style,
      ]}
    >
      {child}
    </NativeText>
  );
};

Text.propTypes = {
  text: string,
  color: string,
  decoration: oneOf(
    ['none', 'underline']
  ),
  fontWeight: string,
  size: string,
  height: oneOfType(
    [number, string]
  ),
  children: oneOfType(
    [number, string, node]
  ),
  align: oneOf(
    ['auto', 'left', 'right', 'center', 'justify']
  ),
  width: oneOfType(
    [number, string]
  ),
  bold: bool,
  fontFamily: string,
  transform: oneOf(
    ['upperCase', 'lowerCase', 'capitalize']
  ),
};

export default Text;
