import React from 'react';
import { View, Platform } from 'react-native';
import { any, oneOf, oneOfType, string, number, array, func } from 'prop-types';

const Box = ({
  children,
  justifyContent,
  alignItems,
  height,
  width,
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
  transition,
  opacity,
  ...restProps
}) => {
  const style = {
    justifyContent,
    alignItems,
    height,
    width,
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
  };

  const webStyle = Platform.OS === 'web' ? {
    transition,
  } : {};

  const nativeStyle = (
    Platform.OS === 'android' ||
    Platform.OS === 'ios'
  ) ? {

  } : {};

  return (
    <View
      {...restProps}
      style={[
        style,
        webStyle,
        nativeStyle,
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
  width: oneOfType(
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
  transition: string,
  opacity: number,
  onPress: func,
};

export default Box;
