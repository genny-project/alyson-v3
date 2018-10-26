import React, { Component } from 'react';
import { object, func } from 'prop-types';
import { Box, Touchable, Input } from '../../../index';

class InputTagInputField extends Component {
  static propTypes = {
    inputProps: object,
    onPress: func,
    onChangeValue: func,
  }

  render() {
    const {
      onPress,
      onChangeValue,
      inputProps,
    } = this.props;

    return (
      <Touchable
        withFeedback
        onPress={onPress}
        style={{
          width: '100%',
          position: 'relative',
        }}
      >
        <Input
          {...inputProps}
          type="text"
          editable={false}
          width="100%"
          onChangeValue={onChangeValue}
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

export default InputTagInputField;
