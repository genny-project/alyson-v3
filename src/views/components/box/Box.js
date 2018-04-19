import React from 'react';
import { View } from 'react-native';
import { any } from 'prop-types';

const Box = ({
  children,
  ...restProps
}) => {
  return (
    <View {...restProps}>
      {children}
    </View>
  );
};

Box.propTypes = {
  children: any,
};

export default Box;
