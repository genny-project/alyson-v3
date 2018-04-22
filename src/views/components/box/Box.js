import React from 'react';
import { View } from 'react-native';
import { any, oneOf, oneOfType, string, number } from 'prop-types';

const Box = ({
  children,
  justifyContent = 'flex-start',
  alignItems = 'flex-start',
  height = 'auto',
  width = 'auto',
  ...restProps
}) => {
  const style = {
    justifyContent,
    alignItems,
    height,
    width,
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
  width: oneOfType(
    [string, number]
  ),
};

export default Box;
