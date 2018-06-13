import React, { Component, Fragment } from 'react';
import { func, string, array } from 'prop-types';
import SidebarMenuItem from '../item';
import { Box } from '../../../../../components';

class SidebarMenuDropdown extends Component {
  static propTypes = {
    isOpen: func,
    onToggle: func,
    onNavigate: func,
    name: string,
    items: array,
    icon: string,
  }

  render() {
    const { onToggle, onNavigate, isOpen, items, name, icon } = this.props;

    return (
      <Fragment>
        <SidebarMenuItem
          onPress={onToggle( name )}
          iconLeft={icon}
          iconRight={isOpen( name ) ? 'expand-less' : 'expand-more'}
          name={name}
        />

        {isOpen( name ) ? (
          <Box
            marginLeft={15}
            flexDirection="column"
          >
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
                  iconLeft={item.icon}
                />
              )
            ))}
          </Box>
        ) : null}
      </Fragment>
    );
  }
}

export default SidebarMenuDropdown;
