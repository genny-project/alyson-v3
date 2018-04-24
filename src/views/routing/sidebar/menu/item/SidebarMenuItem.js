import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { func, string } from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, Box } from '../../../../components';
import styles from './SidebarMenuItem.style';

class SidebarMenuItem extends Component {
  static propTypes = {
    onPress: func,
    name: string,
    path: string,
    iconLeft: string,
    iconRight: string,
  }

  render() {
    const { onPress, name, path, iconLeft, iconRight } = this.props;

    const element = (
      <TouchableOpacity
        onPress={onPress}
        style={styles.wrapper}
      >
        <Box flex={1} flexDirection="row">
          <MaterialIcons
            name={iconLeft}
            style={styles.iconLeft}
          />

          <Text
            style={styles.text}
          >
            {name}
          </Text>
        </Box>

        {iconRight && (
          <MaterialIcons
            name={iconRight}
            style={styles.iconRight}
          />
        )}
      </TouchableOpacity>
    );

    if ( path ) {
      return (
        <Link to={path}>
          {element}
        </Link>
      );
    }

    return element;
  }
}

export default SidebarMenuItem;
