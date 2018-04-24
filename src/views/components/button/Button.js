import React, { createElement } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { string, bool, func, oneOf, number } from 'prop-types';
import Text from '../text';
import Icon from '../icon';
import styles from './Button.style';

const Button = ({
  children = 'Button Text',
  disabled,
  onPress,
  color = 'transparent',
  silent = false,
  icon,
  textColor,
  size = 'md',
  padding,
  paddingX = 15,
  paddingY = 10,
}) => {
  const textColors = {
    red: 'white',
    green: 'white',
    blue: 'white',
    white: 'black',
    transparent: 'black',
  };

  const textSizes = {
    sm: 'xs',
    md: 'sm',
    lg: 'md',
  };

  const child = ( icon != null ) ? (
    <Icon
      color={textColor || textColors[color]}
      name={icon}
      size={size}
    />
  ) : (
    <Text
      color={textColor || textColors[color]}
      decoration="none"
      size={textSizes}
    >
      {children}
    </Text>
  );

  return createElement(
    silent ? TouchableWithoutFeedback : TouchableOpacity,
    {
      disabled,
      onPress,
      style: [
        styles[color],
        {
          padding,
          paddingHorizontal: paddingX,
          paddingVertical: paddingY,
        },
      ],
    },
    child
  );
};

Button.propTypes = {
  children: string,
  disabled: bool,
  onPress: func,
  color: oneOf(
    ['red', 'blue', 'green', 'white', 'transparent']
  ).isRequired,
  textColor: oneOf(
    ['white', 'black']
  ),
  silent: bool,
  icon: string,
  size: oneOf(
    ['sm', 'md', 'lg']
  ),
  padding: number,
  paddingX: number,
  paddingY: number,
};

export default Button;
