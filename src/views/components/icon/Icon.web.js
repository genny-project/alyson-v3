import React from 'react';
import { Text } from 'react-native';
import { oneOf, string } from 'prop-types';

const sizes = {
  xs: 16,
  sm: 18,
  smd: 20,
  md: 24,
  lg: 36,
  xl: 48,
};

const Icon = ({
  name,
  color = 'black',
  size = 'md',
  type = 'material-icons',
}) => {
  const style = {
    fontSize: sizes[size],
    color,
  };

  switch ( type ) {
    case 'material-icons':
      return (
        <i
          className="material-icons"
          style={style}
        >
          {name && name.includes( '-' )
            ? name.replace( /-/g, '_' )
            : name
          }
        </i>
      );

    case 'font-awesome':
      return (
        <i
          className={name}
          style={style}
        />
      );

    default:
      return (
        <Text>
          Icon with invalid type specified: `
          {type}
          `.
        </Text>
      );
  }
};

Icon.propTypes = {
  name: string.isRequired,
  color: string,
  size: oneOf(
    ['xs', 'sm', 'md', 'lg', 'xl']
  ),
  type: string,
};

export default Icon;
