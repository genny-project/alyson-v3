import React from 'react';
// import { bool } from 'prop-types';
import NativeSafeAreaView from 'react-native-safe-area-view';

const SafeAreaView = props => {
  return <NativeSafeAreaView {...props} />;
};

SafeAreaView.propTypes = {};

export default SafeAreaView;
