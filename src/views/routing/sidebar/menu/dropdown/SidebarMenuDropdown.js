import React, { Component } from 'react';
import { View } from 'react-native';
import { func, string, array } from 'prop-types';
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
        <SidebarMenuItem
          onPress={onToggle( name )}
          icon={isOpen( name ) ? 'expand-less' : 'expand-more'}
          name={name}
        />

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
