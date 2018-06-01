import React, { Component } from 'react';
import { number, any, func, string, oneOfType } from 'prop-types';
import { ScrollView } from '../../../components';

class InputScroll extends Component {
  static defaultProps = {
    scrollEventThrottle: 50,
  }

  static propTypes = {
    children: any,
    minHeight: oneOfType(
      [number, string]
    ),
    maxHeight: oneOfType(
      [number, string]
    ),
    onScrollEnd: func,
    height: oneOfType(
      [number, string]
    ),
    scrollEventThrottle: number,
    flex: number,
  }

  state = {
    checkedOnce: false,
    scrollViewHeight: 0,
  }

  handleScroll = ( e ) => {
    const { checkedOnce, scrollViewHeight } = this.state;
    const contentHeight = e.nativeEvent.contentSize.height;
    const offset = e.nativeEvent.contentOffset.y;

    if ( this.props.onScrollEnd ) {
      const isScrollAtEnd = scrollViewHeight + offset >= contentHeight;

      if (
        !isScrollAtEnd ||
        ( checkedOnce && checkedOnce )
      )
        return true;

      this.setState({ checkedOnce: true });

      this.props.onScrollEnd( isScrollAtEnd );
    }
  }

  handleLayout = ({ nativeEvent }) => {
    const { height } = nativeEvent.layout;

    this.setState({ scrollViewHeight: height });
  }

  render() {
    const { children, height, minHeight, maxHeight, scrollEventThrottle, flex } = this.props;

    return (
      <ScrollView
        onLayout={this.handleLayout}
        flex={flex}
        height={height}
        minHeight={minHeight}
        maxHeight={maxHeight}
        onScroll={this.handleScroll}
        scrollEventThrottle={scrollEventThrottle}
      >
        {children}
      </ScrollView>
    );
  }
}

export default InputScroll;
