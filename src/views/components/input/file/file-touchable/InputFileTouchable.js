import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { Input } from '../../../../components';

class InputFileTouchable extends Component {
  static defaultProps = {
    text: 'Upload a file',
  }

  static propTypes = {
    text: string,
    onPress: func,
  }

  render() {
    const {
      text,
      onPress,
    } = this.props;

    return (
      <Input
        type="text"
        icon="add"
        prefixIcon="camera-alt"
        enabled={false}
        onFocus={onPress}
        value={text}
      />
    );
  }
}

export default InputFileTouchable;
