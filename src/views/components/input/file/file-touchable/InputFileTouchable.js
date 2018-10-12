import React, { Component } from 'react';
import { string, func, number ,oneOfType } from 'prop-types';
import { Input, Box, Touchable } from '../../../../components';

class InputFileTouchable extends Component {
  static defaultProps = {
    text: 'Upload a file',
    icon: 'camera-alt',
    width: 260,
    height: 20,
  }

  static propTypes = {
    text: string,
    onPress: func,
    icon: string,
    width: oneOfType ( [string, number] ),
    height: oneOfType( [string, number] ),
  }

  render() {
    const {
      text,
      onPress,
      icon,
      width,
      height,
    } = this.props;

    return (
      <Touchable
        withFeedback
        onPress={onPress}
        style={{
          width: width ,
          height: height,
          position: 'relative',
        }}
        width="100%"
        position="relative"
      >
        <Input
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
