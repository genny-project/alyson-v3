import React from 'react';
import { View, Platform } from 'react-native';
import { any, oneOf, oneOfType, string, number, array, func, bool, object, shape } from 'prop-types';
import { objectClean } from '../../../utils';

const shapeStyles = {
  square: {
    borderRadius: 0,
  },
  rounded: {
    borderRadius: 5,
  },
  circle: {
    borderRadius: 100000,
  },
  pill: {
    borderRadius: 999,
  },
  roundedTop: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  roundedBottom: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  roundedLeft: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 5,
  },
  roundedRight: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 0,
  },
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
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomRightRadius,
  borderBottomLeftRadius,
  cleanStyleObject,
  shape,
  shadowColor,
  shadowOpacity,
  shadowRadius,
  shadowOffset,
  fullHeightOnWeb,
  __dangerouslySetStyle = {},
  overflow,
  overflowX,
  overflowY,
  display = 'flex',
  ...restProps
}) => {
  const borderRadiusStyle = {
    borderRadius: borderRadius,
    borderTopLeftRadius: borderTopLeftRadius,
    borderTopRightRadius: borderTopRightRadius,
    borderBottomRightRadius: borderBottomRightRadius,
    borderBottomLeftRadius: borderBottomLeftRadius,
    ...shapeStyles[shape],
  };

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
    display,
    shadowColor,
    shadowOpacity,
    shadowRadius,
    shadowOffset,
    ...borderRadiusStyle,
    ...__dangerouslySetStyle,
  };

  const webStyle = Platform.OS !== 'web' ? {} : {
    accessibilityRole,
    overflow,
    overflowX,
    overflowY,
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
    [2, 5, 10, 100000]
  ),
  borderTopLeftRadius: oneOf(
    [2, 5, 10, 100000]
  ),
  borderTopRightRadius: oneOf(
    [2, 5, 10, 100000]
  ),
  borderBottomRightRadius: oneOf(
    [2, 5, 10, 100000]
  ),
  borderBottomLeftRadius: oneOf(
    [2, 5, 10, 100000]
  ),
  cleanStyleObject: bool,
  shape: oneOf(
    ['square', 'rounded', 'pill', 'circle']
  ),
  fullHeightOnWeb: bool,
  __dangerouslySetStyle: object,
  overflow: string,
  overflowX: string,
  overflowY: string,
  display: string,
  shadowColor: string,
  shadowOpacity: oneOfType(
    [string, number]
  ),
  shadowRadius: oneOfType(
    [string, number]
  ),
  shadowOffset: shape({
    width: oneOfType(
      [string, number]
    ),
    height: oneOfType(
      [string, number]
    ),
  }),
};

export default Box;
