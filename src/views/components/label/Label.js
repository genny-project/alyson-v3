import React, { Component } from 'react';
import Text from '../text';
import { string } from 'prop-types';

class Label extends Component {
  static propTypes = {
    text: string,
  };

  render() {
    const { text, ...restProps } = this.props;

    return (
      <Text {...restProps}>{text}</Text>
    );
  }
}

export default Label;
