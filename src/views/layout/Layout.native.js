import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { any } from 'prop-types';

class Layout extends Component {
  static propTypes = {
    children: any,
  }

  render() {
    const { children } = this.props;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        {children}
      </SafeAreaView>
    );
  }
}

export default Layout;
