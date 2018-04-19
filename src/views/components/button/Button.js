import React from 'react';
import { TouchableOpacity } from 'react-native';
import { string, bool, func } from 'prop-types';
import Text from '../text';

const Button = ({
  children = 'Button Text',
  disabled,
  onPress,
  ...restProps
}) => {
  return (
    <TouchableOpacity
      {...restProps}
      disabled={disabled}
      onPress={onPress}
    >
      <Text>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  children: string,
  disabled: bool,
  onPress: func,
};

export default Button;
