import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { func, string } from 'prop-types';
import { Link, Box, Icon, Text } from '../../../../components';

class SidebarMenuItem extends Component {
  static propTypes = {
    name: string,
    path: string,
    iconLeft: string,
    iconRight: string,
    onPress: func,
  }

  render() {
    const { name, onPress, path, iconLeft, iconRight } = this.props;

    const element = (
      <TouchableOpacity
        onPress={onPress}
      >
        <Box
          paddingY={10}
          flex={1}
          alignItems="center"
        >
          <Box
            flex={1}
            flexDirection="row"
          >
            <Box paddingX={15}>
              <Icon
                name={iconLeft}
                color="white"
              />
            </Box>

            <Text color="white">
              {name}
            </Text>
          </Box>

          {iconRight && (
            <Box paddingX={15}>
              <Icon
                name={iconRight}
                color="white"
              />
            </Box>
          )}
        </Box>
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
