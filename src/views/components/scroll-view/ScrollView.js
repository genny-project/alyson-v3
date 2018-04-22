import React, { Component } from 'react';
import { ScrollView as ReactNativeScrollView, Platform } from 'react-native';
import { string, func, bool, oneOf, oneOfType, number, any, element } from 'prop-types';
import { RefreshControl } from '../index';

class ScrollView extends Component {
  static propTypes = {
    flex: number,
    height: oneOfType(
      [string, number]
    ),
    width: oneOfType(
      [string, number]
    ),
    horizontal: bool,
    scrollEnabled: bool,
    onScroll: func,
    scrollEventThrottle: number,
    onContentSizeChange: func,
    keyboardDismissMode: oneOf(
      ['none', 'on-drag', 'interactive']
    ),
    children: any,
    onRefresh: func,
    refreshControlElement: element,
    enableRefresh: bool,
    isRefreshing: bool,
  }

  static getDerivedStateFromProps( nextProps, prevState ) {
    if ( nextProps.isRefreshing != null ) {
      if ( nextProps.isRefreshing !== prevState.isRefreshing ) {
        return {
          isRefreshing: nextProps.isRefreshing,
        };
      }
    }

    return null;
  }

  state = {
    isRefreshing: this.props.isRefreshing || false,
  }

  handleRefresh = event => {
    if ( this.props.onRefresh )
      this.props.onRefresh( event );
  }

  render() {
    const {
      flex,
      height,
      width,
      horizontal,
      scrollEnabled,
      onScroll,
      scrollEventThrottle,
      onContentSizeChange,
      keyboardDismissMode,
      children,
      onRefresh,
      refreshControlElement,
      enableRefresh,
    } = this.props;

    const { isRefreshing } = this.state;

    const wrapperStyle = {
      flex,
      height,
      width,
    };

    const contentStyle = {
      flex,
    };

    return (
      <ReactNativeScrollView
        style={wrapperStyle}
        contentContainerStyle={contentStyle}
        horizontal={horizontal}
        scrollEnabled={scrollEnabled}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        onContentSizeChange={onContentSizeChange}
        keyboardDismissMode={keyboardDismissMode}
        refreshControl={(
          (
            Platform.OS === 'ios' ||
            Platform.OS === 'android'
          ) &&
          enableRefresh && (
            refreshControlElement ||
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
            />
          )
        )}
      >
        {children}
      </ReactNativeScrollView>
    );
  }
}

export default ScrollView;
