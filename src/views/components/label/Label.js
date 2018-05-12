import React, { Component } from 'react';
import { string } from 'prop-types';
import Text from '../text';

class Label extends Component {
  static propTypes = {
    text: string,
  };

  render() {
    const { text, ...restProps } = this.props;

    return (
      <Text {...restProps}>
        {text}
      </Text>
    );
  }
}

export default Label;
