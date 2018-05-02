import React from 'react';
import { View } from 'react-native';
import { any, oneOf, oneOfType, string, number, array, func } from 'prop-types';

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
    flex,
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
    transitionDuration,
    transitionProperty,
    transitionTimingFunction,
    transitionDelay,
  };

  return (
    <View
      {...restProps}
      style={style}
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
    ['fixed', 'absolute', 'relative', 'static']
  ),
  top: number,
  right: number,
  bottom: number,
  left: number,
  zIndex: number,
  transform: array,
  transitionDuration: string,
  transitionProperty: string,
  transitionTimingFunction: string,
  transitionDelay: string,
  opacity: number,
  onPress: func,
};

export default Box;
