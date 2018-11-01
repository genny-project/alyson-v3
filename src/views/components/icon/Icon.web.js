import React, { Component } from 'react';
import { Text } from 'react-native';
import { oneOf, string } from 'prop-types';
import styles from './Icon.style';

const sizes = {
  xs: 16,
  sm: 18,
  smd: 20,
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

class Icon extends Component {
  static defaultProps = {
    color: 'white',
    size: 'md',
    type: 'material-icons',
  }

  static propTypes = {
    name: string.isRequired,
    color: string,
    size: oneOf(
      ['xs', 'sm', 'md', 'lg', 'xl']
    ),
    type: string,
  };

  render() {
    const { type, name } = this.props;

    const style = {
      fontFamily: 'Material Icons',
      whiteSpace: 'nowrap',
      fontWeight: 'normal',
      fontStyle: 'normal',
      lineHeight: '1rem',
      direction: 'ltr',
      fontSize: sizes[this.props.size],
      color: colors[this.props.color],
    };

    if ( type === 'font-awesome' )  {
      return (
        <i
          className={name}
          style={{ ...styles.wrapper, ...style }}
        />
      );
    }

    return (
      <Text
        style={[
          styles.wrapper,
          style,
        ]}
      >
        {name && name.includes( '-' )
          ? name.replace( /-/g, '_' )
          : name
        }
      </Text>
    );
  }
}

export default Icon;
