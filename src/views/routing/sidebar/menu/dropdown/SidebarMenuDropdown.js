import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { func, string, array } from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SidebarMenuItem from '../item';
import styles from './SidebarMenuDropdown.style';

class SidebarMenuDropdown extends Component {
  static propTypes = {
    isOpen: func,
    onToggle: func,
    onNavigate: func,
    name: string,
    items: array,
  }

  render() {
    const { onToggle, onNavigate, isOpen, items, name } = this.props;

    return (
      <View>
        <TouchableOpacity
          onPress={onToggle( name )}
          style={styles.wrapper}
        >
          <Text
            style={styles.text}
          >
            {name}
          </Text>

          <MaterialCommunityIcons
            name={isOpen( name ) ? 'chevron-down' : 'chevron-right'}
            style={styles.icon}
          />
        </TouchableOpacity>

        {isOpen( name ) && (
          <View style={styles.nested}>
            {items.map( item => (
              item.isDropdown ? (
                <SidebarMenuDropdown
                  {...item}
                  key={item.name}
                  onNavigate={onNavigate}
                  onToggle={onToggle}
                  isOpen={isOpen}
                />
              ) : (
                <SidebarMenuItem
                  {...item}
                  onNavigate={onNavigate}
                  key={item.name}
                />
              )
            ))}
          </View>
        )}
      </View>
    );
  }
}

export default SidebarMenuDropdown;
