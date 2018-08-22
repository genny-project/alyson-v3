import React from 'react';
import { View, Platform } from 'react-native';
import { any, oneOf, oneOfType, string, number, array, func, bool, object } from 'prop-types';
import { objectClean } from '../../../utils';

const shapeStyles = {
  square: 0,
  rounded: 5,
  circle: 100000,
  pill: 999,
};

const boxShadows = {
  light: {
    shadowColor: 'black',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      height: 4,
      width: 0,
    },
  },
  medium: {},
  dark: {},
};

const Box = ({
  children,
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
  flexDirection = 'row',
  flexWrap,
  padding,
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
  accessible,
  accessibilityRole,
  accessibilityLabel,
  borderTopWidth,
  borderRightWidth,
  borderBottomWidth,
  borderLeftWidth,
  borderWidth,
  borderColor,
  borderStyle,
  borderRadius,
  cleanStyleObject,
  shape,
  boxShadow,
  fullHeightOnWeb,
  __dangerouslySetStyle = {},
  overflow,
  overflowX,
  overflowY,
  display = 'flex',
  ...restProps
}) => {
  const boxStyle = {
    justifyContent,
    alignItems,
    height: Platform.OS === 'web' && fullHeightOnWeb ? '100vh' : height,
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
    paddingHorizontal: paddingX,
    paddingVertical: paddingY,
    margin,
    marginHorizontal: marginX,
    marginVertical: marginY,
    marginTop,
    marginRight,
    marginLeft,
    marginBottom,
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
    borderRadius: borderRadius || shapeStyles[shape],
    ...boxShadow && (
      boxShadows[boxShadow]
    ),
    overflow,
    overflowX,
    overflowY,
    display,
    ...__dangerouslySetStyle,
  };

  const webStyle = Platform.OS !== 'web' ? {} : {
    transitionDuration,
    transitionProperty,
    transitionTimingFunction,
    transitionDelay,
  };

  return (
    <View
      {...restProps}
      accessible={accessible}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      style={[
        cleanStyleObject
          ? objectClean( boxStyle )
          : boxStyle,
        webStyle,
      ]}
    >
      {children}
    </View>
  );
};

Box.propTypes = {
  children: any,
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
  borderRadius: oneOf(
    [2, 5, 10, '50%']
  ),
  cleanStyleObject: bool,
  shape: oneOf(
    ['square', 'rounded', 'pill', 'circle']
  ),
  boxShadow: oneOf(
    ['light', 'medium', 'dark']
  ),
  fullHeightOnWeb: bool,
  __dangerouslySetStyle: object,
  overflow: string,
  overflowX: string,
  overflowY: string,
  display: string,
};

export default Box;
