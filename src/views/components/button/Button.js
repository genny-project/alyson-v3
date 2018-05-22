import React, { createElement } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback, Platform } from 'react-native';
import { string, bool, func, oneOf, number, oneOfType } from 'prop-types';
import { Text, Icon, Box } from '../index';

const buttonColors = {
  red: 'red',
  green: 'green',
  blue: 'blue',
  white: 'white',
  transparent: 'transparent',
  disabled: 'lightgrey',
  black: 'black',
};

const textColors = {
  red: 'white',
  green: 'white',
  blue: 'white',
  white: 'black',
  transparent: 'black',
  disabled: 'white',
  black: 'white',
};

const textSizes = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

const Button = ({
  children = 'Button Text',
  disabled,
  onPress,
  color = 'green',
  silent = false,
  icon,
  textColor,
  size = 'md',
  padding,
  paddingX = 15,
  paddingY = 10,
  accessible = true,
  accessibilityLabel,
  accessibilityRole = 'button',
  width,
  height,
}) => {
  const child = ( icon != null ) ? (
    <Icon
      color={textColor || textColors[color]}
      name={icon}
      size={size}
    />
  ) : ( typeof children === 'string' ) ? (
    <Text
      color={textColor || textColors[color]}
      decoration="none"
      size={textSizes[size]}
      align="center"
      width="100%"
    >
      {children}
    </Text>
  ) : (
    children || null
  );

  const childWrapper = (
    <Box
      backgroundColor={(
        disabled
          ? buttonColors.disabled
          : buttonColors[color]
      )}
      padding={padding}
      paddingX={paddingX}
      paddingY={paddingY}
      width="100%"
      cleanStyleObject
    >
      {child}
    </Box>
  );

  const style = {
    height,
    width,
  };

  return createElement(
    silent
      ? TouchableWithoutFeedback
      : (
        Platform.OS === 'android'
          ? TouchableNativeFeedback
          : TouchableOpacity
      ),
    {
      style,
      disabled,
      onPress,
      accessible,
      accessibilityLabel,
      accessibilityRole,
      background: (
        Platform.OS === 'android'
          ? TouchableNativeFeedback.Ripple( textColors[color], false )
          : undefined
      ),
    },
    childWrapper
  );
};

Button.propTypes = {
  children: string,
  disabled: bool,
  onPress: func,
  color: string,
  textColor: string,
  silent: bool,
  icon: string,
  size: oneOf(
    ['sm', 'md', 'lg']
  ),
  padding: number,
  paddingX: number,
  paddingY: number,
  accessibilityLabel: string,
  accessibilityRole: string,
  accessible: bool,
  width: oneOfType(
    [number, string]
  ),
  height: oneOfType(
    [number, string]
  ),
};

export default Button;
