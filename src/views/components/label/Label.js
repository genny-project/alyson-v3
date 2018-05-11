import React, { Component } from 'react';
import Text from '../text';
import { string } from 'prop-types';

class Label extends Component {
  static propTypes = {
    text: string,
  };

  render() {
    return (
      <Text>{this.props.text}</Text>
    );
  }
}

export default Label;
