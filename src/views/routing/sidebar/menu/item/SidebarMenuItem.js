import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { func, string } from 'prop-types';
import styles from './SidebarMenuItem.style';

class SidebarMenuItem extends Component {
  static propTypes = {
    onNavigate: func,
    name: string,
    path: string,
  }

  render() {
    const { onNavigate, name, path } = this.props;

    return (
      <TouchableOpacity
        onPress={onNavigate( path )}
        style={styles.wrapper}
      >
        <Text
          style={styles.text}
        >
          {name}
        </Text>
      </TouchableOpacity>
    );
  }
}

export default SidebarMenuItem;
