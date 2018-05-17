import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { func, string } from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, Box, Icon, Text } from '../../../../../components';
import { closeSidebar } from '../../../../../../redux/actions';

class SidebarMenuItem extends Component {
  static propTypes = {
    name: string,
    path: string,
    iconLeft: string,
    iconRight: string,
    onPress: func,
    closeSidebar: func,
  }

  render() {
    const { name, onPress, path, iconLeft, iconRight, closeSidebar } = this.props;

    const element = (
      <TouchableOpacity
        onPress={onPress}
        style={{
          flex: 1,
          alignItems: 'center',
        }}
      >
        <Box
          paddingY={10}
          flex={1}
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Box
            flex={1}
            alignItems="center"
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

          {iconRight ? (
            <Box paddingX={15}>
              <Icon
                name={iconRight}
                color="white"
              />
            </Box>
          ) : null}
        </Box>
      </TouchableOpacity>
    );

    if ( path ) {
      return (
        <Link to={path} onPress={closeSidebar}>
          {element}
        </Link>
      );
    }

    return element;
  }
}

export { SidebarMenuItem };

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ closeSidebar }, dispatch );
};

export default connect( null, mapDispatchToProps )( SidebarMenuItem );
