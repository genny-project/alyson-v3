import React from 'react';
import { Text } from 'react-native';
import { oneOf, string } from 'prop-types';
import styles from './Icon.style';

const Icon = ({
  name,
  color = 'white',
  size = 'md',
}) => {
  const style = {
    fontFamily: 'Material Icons',
    whiteSpace: 'nowrap',
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: '1rem',
    direction: 'ltr',
  };

  return (
    <Text
      style={[
        styles.wrapper,
        styles[color],
        styles[size],
        style,
      ]}
    >
      {name.includes( '-' )
        ? name.replace( /-/g, '_' )
        : name
      }
    </Text>
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
