import React, { Component } from 'react';
import { string } from 'prop-types';
import Text from '../text';

class Label extends Component {
  static defaultProps = {
    testID: 'label',
  }

  static propTypes = {
    text: string,
    testID: string,
  };

  render() {
    const { text, testID, ...restProps } = this.props;

    return (
      <Text
        {...restProps}
        testID={testID}
      >
        {text}
      </Text>
    );
  }
}

export default Label;
