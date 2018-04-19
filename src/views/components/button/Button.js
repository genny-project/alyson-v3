import React from 'react';
import { TouchableOpacity } from 'react-native';
import { string, bool, func, oneOf } from 'prop-types';
import Text from '../text';
import styles from './Button.style';

const Button = ({
  children = 'Button Text',
  disabled,
  onPress,
  color = 'red',
  ...restProps
}) => {
  const textColors = {
    red: 'white',
    green: 'white',
    blue: 'white',
    white: 'black',
  };

  return (
    <TouchableOpacity
      {...restProps}
      disabled={disabled}
      onPress={onPress}
      style={[styles.wrapper, styles[color]]}
    >
      <Text
        color={textColors[color]}
        decoration="none"
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  children: string,
  disabled: bool,
  onPress: func,
  color: oneOf(
    ['red', 'blue', 'green', 'white']
  ).isRequired,
};

export default Button;
