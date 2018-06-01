import React from 'react';
import { oneOf, string } from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';

const sizes = {
  sm: 18,
  md: 24,
  lg: 36,
  xl: 48,
};

const colors = {
  white: 'white',
  black: 'black',
  red: 'red',
  blue: 'blue',
  green: 'green',
  grey: 'grey',
  lightGrey: 'lightgrey',
  yellow: 'yellow',
};

const Icon = ({
  name,
  color = 'white',
  size = 'md',
}) => {
  const style = {
    fontSize: sizes[size],
    color: colors[color] || color,
  };

  return (
    <MaterialIcons
      name={name}
      style={style}
    />
  );
};

Icon.propTypes = {
  name: string.isRequired,
  color: string,
  size: oneOf(
    ['xs', 'sm', 'md', 'lg', 'xl']
  ),
};

export default Icon;
