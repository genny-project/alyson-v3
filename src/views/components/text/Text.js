import React from 'react';
import { Text as NativeText } from 'react-native';
import { string } from 'prop-types';

const Text = ({
  children,
  ...restProps
}) => {
  return (
    <NativeText
      {...restProps}
    >
      {children}
    </NativeText>
  );
};

Text.propTypes = {
  children: string,
};

export default Text;
