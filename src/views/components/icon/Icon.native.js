import { createElement } from 'react';
import { oneOf, string } from 'prop-types';
import { MaterialIcons, Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

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

  return createElement( types[type], { name, style });
};

Icon.propTypes = {
  name: string.isRequired,
  color: string,
  size: oneOf(
    ['xs', 'sm', 'md', 'lg', 'xl']
  ),
  type: oneOf(
    ['material-icons', 'feather']
  ),
};

export default Icon;
