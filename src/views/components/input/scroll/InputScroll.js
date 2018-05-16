import React, { Component } from 'react';
import { number, any, func } from 'prop-types';
import { ScrollView } from '../../../components';

class InputScroll extends Component {
  static defaultProps = {
    height: 200,
  }

  static propTypes = {
    children: any,
    height: number,
    onScrollEnd: func,
  }

  state = {
    checkedOnce: false,
  }

  handleScroll = ( e ) => {
    const { height } = this.props;
    const { checkedOnce } = this.state;
    const contentHeight = e.nativeEvent.contentSize.height;
    const offset = e.nativeEvent.contentOffset.y;
     
    if ( this.props.onScrollEnd ) {
      const isScrollAtEnd = height + offset >= contentHeight;

      if (
        !isScrollAtEnd ||
        ( checkedOnce && checkedOnce )
      )
        return;

      this.setState({ checkedOnce: true });

      this.props.onScrollEnd( isScrollAtEnd );
    }
  }

  render() {
    const { children, height } = this.props;

    return (
      <ScrollView
        height={height}
        onScroll={this.handleScroll}
        scrollEventThrottle={20}
      >
        {children}
      </ScrollView>
    );
  }
}

export default InputScroll;
