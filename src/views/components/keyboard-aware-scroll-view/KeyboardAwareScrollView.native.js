import React from 'react';
import { KeyboardAwareScrollView as Kasv } from 'react-native-keyboard-aware-scroll-view';
import { node } from 'prop-types';

const KeyboardAwareScrollView = ({
  children,
}) => {
  return (
    <Kasv>
      {children}
    </Kasv>
  );
};

KeyboardAwareScrollView.propTypes = {
  children: node,
};

export default KeyboardAwareScrollView;
