import { createElement } from 'react';
import { oneOf, string } from 'prop-types';
import { MaterialIcons, Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const sizes = {
  xs: 16,
  sm: 18,
  md: 24,
  lg: 36,
  xl: 48,
  xxl: 64,
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

const types = {
  'material-icons': MaterialIcons,
  'material-icons-community': MaterialCommunityIcons,
  'feather': Feather,
  'font-awesome': FontAwesome,
};

const Icon = ({
  name,
  color = 'white',
  size = 'md',
  type = 'material-icons',
}) => {
  const style = {
    fontSize: sizes[size],
    color: colors[color] || color,
  };

  const normalizedName = name.replace( /_/g, '-' );

  return createElement( types[type], {
    name: normalizedName,
    style,
  });
};

Icon.propTypes = {
  name: string.isRequired,
  color: string,
  size: oneOf(
    ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']
  ),
  type: oneOf(
    ['material-icons', 'feather', 'font-awesome', 'material-icons-community']
  ),
};

export default Icon;
