import React, { Component } from 'react';
import { object, func, bool, string } from 'prop-types';
import { Box, Input } from '../../../index';

class InputTagInputField extends Component {
  static propTypes = {
    inputProps: object,
    getInputProps: func,
    onPress: func,
    handleFocus: func,
    shouldFocus: bool,
    inputValue: string,
    onChangeValue: func,
  }

  render() {
    const {
      onPress,
      inputProps,
      getInputProps,
      onChangeValue,
      inputValue,
      shouldFocus,
    } = this.props;

    return (
      <Box
        flexDirection="column"
        onClick={() => {
          onPress();
          shouldFocus && this.input.focus();
        }}
      >
        <Input
          {...getInputProps({
            ...inputProps,
            type: 'text',
            width: '100%',
            ref: input => this.input = input,
            onChangeValue: onChangeValue,
            value: inputValue,
          })}
        />
      </Box>
    );
  }
}

export default InputTagInputField;
