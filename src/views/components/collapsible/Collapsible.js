import React, { Component } from 'react';
import { any, bool, func, object } from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Box, Icon }  from '../../components';
import Recursive from '../layout-loader/Recursive';

class Collapsible extends Component {
  static defaultProps = {
    showHeader: true,
    wrapperProps: {},
    headerWrapperProps: {},
    headerIconProps: {},
  }

  static propTypes = {
    children: any,
    showHeader: bool,
    header: any,
    // open: bool,
    headerWithoutTouchable: bool,
    onToggle: func,
    wrapperProps: object,
    headerWrapperProps: object,
    headerIconProps: object,
  }

  // static getDerivedStateFromProps( nextProps, nextState ) {
  //   if (
  //     nextProps.open != null &&
  //     nextProps.open !== undefined &&
  //     nextProps.open !== nextState.open
  //   ) {
  //     return { isOpen: nextProps.open };
  //   }

  //   return null;
  // }

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
      header,
      headerWithoutTouchable,
      wrapperProps,
      headerWrapperProps,
      headerIconProps,
    } = this.props;

    const { isOpen } = this.state;

    return (
      <Box
        justifyContent="center"
        flexDirection="column"
        {...wrapperProps}
      >
        {showHeader
          ? headerWithoutTouchable && header
            ? (
              <Recursive
                {...header}
                props={{
                  ...header.props,
                  isOpen: isOpen,
                  onPress: this.handlePress,
                }}
              />
            )
            : (
              <TouchableOpacity
                onPress={this.handlePress}
              >
                {
                  header
                    ? (
                      <Recursive
                        {...header}
                        props={{
                          ...header.props,
                          isOpen: isOpen,
                        }}
                      />
                    )
                    : (
                      <Box
                        justifyContent="center"
                        transform={[
                          { rotate: isOpen ? '180deg' : '0deg' },
                        ]}
                        {...headerWrapperProps}
                      >
                        <Icon
                          name="keyboard_arrow_down"
                          color="black"
                          {...headerIconProps}
                        />
                      </Box>
                    )
                }
              </TouchableOpacity>
            ) : null}
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
