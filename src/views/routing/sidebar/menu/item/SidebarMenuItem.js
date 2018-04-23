import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { func, string } from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from '../../../../components';
import styles from './SidebarMenuItem.style';

class SidebarMenuItem extends Component {
  static propTypes = {
    onPress: func,
    name: string,
    path: string,
    icon: string,
  }

  render() {
    const { onPress, name, path, icon } = this.props;

    const element = (
      <TouchableOpacity
        onPress={onPress}
        style={styles.wrapper}
      >
        <MaterialIcons
          name={icon}
          style={styles.icon}
        />

        <Text
          style={styles.text}
        >
          {name}
        </Text>
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
