import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { func, string } from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { LayoutConsumer } from '../../../../../layout';
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
      <LayoutConsumer>
        {layout => (
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
                  {iconLeft ? (
                    <Icon
                      name={iconLeft}
                      color={layout.textColor}
                    />
                  ) : (
                    <Box width={24} />
                  )}
                </Box>

                <Text color={layout.textColor}>
                  {name}
                </Text>
              </Box>

              {iconRight ? (
                <Box paddingX={15}>
                  <Icon
                    name={iconRight}
                    color={layout.textColor}
                  />
                </Box>
              ) : null}
            </Box>
          </TouchableOpacity>
        )}
      </LayoutConsumer>
    );

    if ( path ) {
      return (
        <Link
          to={path}
          onPress={closeSidebar}
        >
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
