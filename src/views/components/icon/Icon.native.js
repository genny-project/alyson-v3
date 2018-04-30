import React from 'react';
import { oneOf, string } from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './Icon.style';

const Icon = ({
  name,
  color = 'white',
  size = 'md',
}) => {
  return (
    <MaterialIcons
      name={name}
      style={[
        styles[size],
        styles[color],
      ]}
    />
  );
};

Icon.propTypes = {
  name: string.isRequired,
  color: oneOf(
    ['white', 'black', 'red', 'green', 'yellow', 'grey', 'lightGrey']
  ).isRequired,
  size: oneOf(
    ['xs', 'sm', 'md', 'lg', 'xl']
  ),
};

export default Icon;
