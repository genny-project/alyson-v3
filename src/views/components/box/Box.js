import React from 'react';
import { View, Platform } from 'react-native';
import { any, oneOf, oneOfType, string, number, array, func, bool } from 'prop-types';

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
  flexDirection = 'row',
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
  ...restProps
}) => {
  const style = {
    justifyContent,
    alignItems,
    height,
    minHeight,
    maxHeight,
    width,
    minWidth,
    maxWidth,
    flex: typeof flex === 'number' ? flex : undefined,
    flexDirection,
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
    position,
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
        style,
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
  flex: number,
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
};

export default Box;
