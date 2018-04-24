import React from 'react';
import { View } from 'react-native';
import { any, oneOf, oneOfType, string, number } from 'prop-types';
import range from 'lodash.range';

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
  };

  return (
    <View
      style={style}
    >
      {children}
    </View>
  );
};

const paddingMarginPropType = range( 0, 12 );

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
  padding: oneOf( paddingMarginPropType ),
  paddingX: oneOf( paddingMarginPropType ),
  paddingY: oneOf( paddingMarginPropType ),
  margin: oneOf( paddingMarginPropType ),
  marginX: oneOf( paddingMarginPropType ),
  marginY: oneOf( paddingMarginPropType ),
  marginTop: oneOf( paddingMarginPropType ),
  marginRight: oneOf( paddingMarginPropType ),
  marginBottom: oneOf( paddingMarginPropType ),
  marginLeft: oneOf( paddingMarginPropType ),
  backgroundColor: string,
};

export default Box;
