import React, { Component } from 'react';
import { any, bool, func, string, object, node } from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Box, Icon, Touchable }  from '../../components';

class Collapsible extends Component {
  static defaultProps = {
    showHeader: true,
    testID: 'collapsible',
    wrapperProps: {},
    headerWrapperProps: {},
    headerIconProps: {},
  }

  static propTypes = {
    children: any,
    showHeader: bool,
    // open: bool,
    onToggle: func,
    testID: string,
    wrapperProps: object,
    headerWrapperProps: object,
    headerIconProps: object,
    renderHeader: node,
  }

  state = {
    isOpen: false,
  }

  handlePress = () => {
    this.setState( state => ({ isOpen: !state.isOpen }));
    // if ( this.props.onToggle ) this.props.onToggle();
  }

  render() {
    const {
      children,
      showHeader,
      testID,
      wrapperProps,
      headerWrapperProps,
      headerIconProps,
      renderHeader,
    } = this.props;

    const { isOpen } = this.state;

    return (
      <Box
        justifyContent="center"
        flexDirection="column"
        testID={testID}
        {...wrapperProps}
      >
        {showHeader
          ? (
            <Touchable
              withFeedback
              onPress={this.handlePress}
            >
              <Box
                flex={1}
                justifyContent="space-between"
              >
                {/* header alt goes here */}
                {renderHeader}
                <Box
                  justifyContent="center"
                  transform={[
                    { rotate: isOpen ? '0deg' : '270deg' },
                  ]}
                  {...headerWrapperProps}
                >
                  <Icon
                    name="keyboard_arrow_down"
                    color="black"
                    {...headerIconProps}
                  />
                </Box>
              </Box>
            </Touchable>
          ) : null
        }
        {isOpen ? (
          React.Children.map( children, child => (
            React.cloneElement( child, {
              ...child.props,
              isOpen: isOpen,
            })
          ))
        ) : null}
      </Box>
    );
  }
}

export default Collapsible;
