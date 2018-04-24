import React, { Component } from 'react';
import { View } from 'react-native';
import { array, object } from 'prop-types';
import SidebarMenuItem from './item';
import SidebarMenuDropdown from './dropdown';

class SidebarMenu extends Component {
  static propTypes = {
    items: array,
    navigation: object,
  }

  state = {
    open: [],
  }

  handleToggle = name => () => {
    this.setState( state => {
      /* If the section is already open, close it. */
      if ( state.open.includes( name ))
        return { open: state.open.filter( item => item !== name ) };

      /* If the section isn't already open, open it. */
      return { open: state.open.concat( name ) };
    });
  }

  isOpen = name => {
    const { open } = this.state;

    return open.includes( name );
  }

  render() {
    const { items } = this.props;

    return (
      <View>
        {items.map( item => (
          item.isDropdown ? (
            <SidebarMenuDropdown
              {...item}
              key={item.name}
              onToggle={this.handleToggle}
              isOpen={this.isOpen}
            />
          ) : (
            <SidebarMenuItem
              {...item}
              key={item.name}
              iconLeft={item.icon}
            />
          )
        ))}
      </View>
    );
  }
}

export default SidebarMenu;
