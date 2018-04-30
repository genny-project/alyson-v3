import React from 'react';
import { Text } from 'react-native';
import { oneOf, string, number, oneOfType, array } from 'prop-types';
import styles from './Icon.style';

const Icon = ({
  name,
  color = 'white',
  size = 'md',
  position,
  top,
  right,
  left,
  bottom,
  transform,
}) => {
  const style = {
    fontFamily: 'Material Icons',
    whiteSpace: 'nowrap',
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 1,
    direction: 'ltr',
    position,
    top,
    right,
    left,
    bottom,
    transform,
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
  position: oneOf(
    ['static', 'relative', 'absoulute', 'fixed']
  ),
  top: oneOfType(
    [number, string]
  ),
  right: oneOfType(
    [number, string]
  ),
  left: oneOfType(
    [number, string]
  ),
  bottom: oneOfType(
    [number, string]
  ),
  transform: array,
};

export default Icon;
