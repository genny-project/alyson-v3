import React, { Component } from 'react';
import { RefreshControl as ReactNativeRefreshControl } from 'react-native';
import { string, func, bool, array, number } from 'prop-types';

class RefreshControl extends Component {
  static defaultProps = {
    testID: 'refresh-control',
  }

  static propTypes = {
    refreshing: bool,
    colors: array,
    progressBackgroundColor: string,
    progressViewOffset: number,
    size: number,
    tintColor: string,
    title: string,
    titleColor: string,
    onRefresh: func,
    enabled: bool,
    testID: string,
  }

  render() {
    const {
      refreshing,
      colors,
      progressBackgroundColor,
      progressViewOffset,
      size,
      tintColor,
      title,
      titleColor,
      onRefresh,
      enabled,
      testID,
    } = this.props;

    return (
      <ReactNativeRefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={colors}
        enabled={enabled}
        progressBackgroundColor={progressBackgroundColor}
        size={size}
        tintColor={tintColor}
        title={title}
        titleColor={titleColor}
        progressViewOffset={progressViewOffset}
        testID={testID}
      />
    );
  }
}

export default RefreshControl;
