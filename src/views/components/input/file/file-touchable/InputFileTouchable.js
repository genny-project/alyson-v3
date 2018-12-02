import React, { Component } from 'react';
import { string, func, object } from 'prop-types';
import { Input, Box, Touchable } from '../../../../components';

class InputFileTouchable extends Component {
  static defaultProps = {
    text: 'Upload a file',
    icon: 'camera-alt',
  }

  static propTypes = {
    text: string,
    onPress: func,
    icon: string,
    wrapperProps: object,
  }

  render() {
    const {
      text,
      onPress,
      icon,
      wrapperProps,
      ...restProps
    } = this.props;

    return (
      <Touchable
        withFeedback
        onPress={onPress}
        width="100%"
        position="relative"
        {...wrapperProps}
      >
        <Input
          {...restProps}
          type="text"
          icon={icon}
          editable={false}
          placeholder={text}
        />

        <Box
          width="100%"
          height="100%"
          position="absolute"
          top={0}
          left={0}
        />
      </Touchable>
    );
  }
}

export default InputFileTouchable;
