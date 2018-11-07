import React, { Component } from 'react';
import { TouchableWithoutFeedback, TouchableOpacity, Platform } from 'react-native';
import { node, bool, object, func, oneOf, oneOfType, string, number, array, shape, any } from 'prop-types';
import { store } from '../../../redux';

class Touchable extends Component {
  static defaultProps = {
    flexDirection: 'row',
    display: 'flex',
    __dangerouslySetStyle: {},
    hoverProps: {},
  }

  static propTypes = {
    children: node,
    withFeedback: bool,
    hoverProps: object,
    onMouseEnter: func,
    onMouseLeave: func,
    justifyContent: oneOf(
      ['flex-start', 'flex-end', 'center', 'space-between', 'space-around']
    ),
    alignItems: oneOf(
      ['flex-start', 'flex-end', 'center', 'space-between', 'space-around']
    ),
    height: oneOfType(
      [string, number]
    ),
    minHeight: oneOfType(
      [string, number]
    ),
    maxHeight: oneOfType(
      [string, number]
    ),
    width: oneOfType(
      [string, number]
    ),
    minWidth: oneOfType(
      [string, number]
    ),
    maxWidth: oneOfType(
      [string, number]
    ),
    flexDirection: oneOf(
      ['row', 'row-reverse', 'column', 'column-reverse']
    ),
    flexWrap: oneOf(
      ['nowrap', 'wrap', 'wrap-reverse']
    ),
    flex: number,
    flexBasis: number,
    flexGrow: number,
    flexShrink: number,
    padding: number,
    paddingTop: number,
    paddingRight: number,
    paddingLeft: number,
    paddingBottom: number,
    paddingX: number,
    paddingY: number,
    margin: number,
    marginX: number,
    marginY: number,
    marginTop: number,
    marginRight: number,
    marginBottom: number,
    marginLeft: number,
    backgroundColor: string,
    position: oneOf(
      ['fixed', 'absolute', 'relative', 'static', 'sticky']
    ),
    top: oneOfType(
      [number, string]
    ),
    right: oneOfType(
      [number, string]
    ),
    bottom: number,
    left: oneOfType(
      [number, string]
    ),
    zIndex: number,
    transform: array,
    transitionDuration: string,
    transitionProperty: string,
    transitionTimingFunction: string,
    transitionDelay: string,
    opacity: number,
    onLayout: func,
    onPress: func,
    accessible: bool,
    accessibilityRole: string,
    accessibilityLabel: string,
    borderTopWidth: number,
    borderRightWidth: number,
    borderBottomWidth: number,
    borderLeftWidth: number,
    borderWidth: number,
    borderColor: string,
    borderStyle: string,
    borderRadius: oneOfType(
      [string, number]
    ),
    __dangerouslySetStyle: object,
    overflow: string,
    overflowX: string,
    overflowY: string,
    display: string,
    dispatchActionOnClick: shape({
      type: string.isRequired,
      payload: any,
    }),
  }

  state = {
    isHovering: false,
  }

  handleMouseEnter = event => {
    this.setState({ isHovering: true });

    if ( this.props.onMouseEnter )
      this.props.onMouseEnter( event );
  }

  handleMouseLeave = () => {
    this.setState({ isHovering: false });

    if ( this.props.onMouseLeave )
      this.props.onMouseLeave( event );
  }

  handlePress = event => {
    const { dispatchActionOnClick } = this.props;

    if ( dispatchActionOnClick )
      store.dispatch( dispatchActionOnClick );

    if ( this.props.onPress )
      this.props.onPress( event );
  }

  /** Ensure the props we're going to use were indeed passed through. */
  filterOutUnspecifiedProps( props ) {
    const keys = Object.keys( props );

    return keys.reduce(( filteredProps, prop ) => {
      if ( props[prop] != null )
        filteredProps[prop] = props[prop];

      return filteredProps;
    }, {});
  }

  render() {
    const {
      withFeedback,
      children,
      hoverProps,
      justifyContent,
      alignItems,
      height,
      minHeight,
      maxHeight,
      width,
      minWidth,
      maxWidth,
      flex,
      flexBasis,
      flexGrow,
      flexShrink,
      flexDirection,
      flexWrap,
      padding,
      paddingTop,
      paddingRight,
      paddingLeft,
      paddingBottom,
      paddingX,
      paddingY,
      margin,
      marginX,
      marginY,
      marginTop,
      marginRight,
      marginLeft,
      marginBottom,
      backgroundColor,
      position,
      top,
      right,
      bottom,
      left,
      zIndex,
      transform,
      transitionDuration,
      transitionProperty,
      transitionTimingFunction,
      transitionDelay,
      opacity,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
      borderWidth,
      borderColor,
      borderStyle,
      borderRadius,
      __dangerouslySetStyle,
      overflow,
      overflowX,
      overflowY,
      display,
      ...restProps
    } = this.props;

    const { isHovering } = this.state;

    const touchableStyle = this.filterOutUnspecifiedProps({
      padding,
      paddingTop,
      paddingRight,
      paddingLeft,
      paddingBottom,
      paddingHorizontal: paddingX,
      paddingVertical: paddingY,
      margin,
      marginHorizontal: marginX,
      marginVertical: marginY,
      marginTop,
      marginRight,
      marginLeft,
      marginBottom,
      justifyContent,
      alignItems,
      height,
      minHeight,
      maxHeight,
      width,
      minWidth,
      maxWidth,
      flex,
      flexBasis,
      flexGrow,
      flexShrink,
      flexDirection,
      flexWrap,
      backgroundColor,
      position: (
        (
          position === 'sticky' &&
          Platform.OS !== 'web'
        )
          ? 'relative'
          : position
      ),
      top,
      right,
      bottom,
      left,
      zIndex,
      transform,
      opacity,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
      borderWidth,
      borderColor,
      borderStyle,
      borderRadius,
      overflow,
      overflowX,
      overflowY,
      display,
      ...__dangerouslySetStyle,
    });

    const webStyle = Platform.OS !== 'web' ? {} : this.filterOutUnspecifiedProps({
      transitionDuration,
      transitionProperty,
      transitionTimingFunction,
      transitionDelay,
    });

    const Element = (
      !withFeedback
        ? TouchableWithoutFeedback
        : TouchableOpacity
    );

    return (
      <Element
        {...restProps}
        {...isHovering ? hoverProps : {}}
        style={[
          touchableStyle,
          webStyle,
          isHovering ? hoverProps.style : {},
        ]}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onPress={this.handlePress}
      >
        {children}
      </Element>
    );
  }
}

export default Touchable;
