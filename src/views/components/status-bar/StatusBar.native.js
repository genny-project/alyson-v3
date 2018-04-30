import React, { Component, Fragment } from 'react';
import { StatusBar as ReactNativeStatusBar, View } from 'react-native';
import { string, bool, any } from 'prop-types';

class StatusBar extends Component {
  static propTypes = {
    animated: bool,
    barStyle: string,
    hidden: bool,
    backgroundColor: string,
    translucent: bool,
    networkActivityIndicatorVisible: bool,
    showHideTransition: bool,
    children: any,
  }

  render() {
    const {
      animated,
      barStyle,
      hidden,
      backgroundColor,
      translucent,
      networkActivityIndicatorVisible,
      showHideTransition,
      children,
    } = this.props;

    return (
      <Fragment>
        <View style={{ backgroundColor }}>
          <ReactNativeStatusBar
            animated={animated}
            barStyle={barStyle}
            hidden={hidden}
            backgroundColor={backgroundColor}
            translucent={translucent}
            networkActivityIndicatorVisible={networkActivityIndicatorVisible}
            showHideTransition={showHideTransition}
          />
        </View>

        {children}
      </Fragment>
    );
  }
}

export default StatusBar;
