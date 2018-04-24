import React from 'react';
import { Text } from 'react-native';
import { oneOf, string } from 'prop-types';
import styles from './Icon.style';

const Icon = ({
  name,
  color = 'white',
  size = 'md',
}) => {
  return (
    <Text
      style={[
        styles.wrapper,
        styles[color],
        styles[size],
        {
          fontFamily: 'Material Icons',
          whiteSpace: 'nowrap',
          fontWeight: 'normal',
          fontStyle: 'normal',
          lineHeight: 1,
          direction: 'ltr',
        },
      ]}
    >
      {name}
    </Text>
  );
};

Icon.propTypes = {
  name: string.isRequired,
  color: oneOf(
    ['white', 'black', 'red']
  ).isRequired,
  size: oneOf(
    ['xs', 'sm', 'md', 'lg', 'xl']
  ),
};

export default Icon;
