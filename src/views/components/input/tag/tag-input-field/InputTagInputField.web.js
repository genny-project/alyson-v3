import React, { Component } from 'react';
import { object, func, bool, string } from 'prop-types';
import { Box, Input, Icon } from '../../../index';

class InputTagInputField extends Component {
  static propTypes = {
    inputProps: object,
    getInputProps: func,
    onPress: func,
    handleFocus: func,
    shouldFocus: bool,
    inputValue: string,
    onChangeValue: func,
    isOpen: bool,
    testID: string,
  }

  render() {
    const {
      onPress,
      inputProps,
      getInputProps,
      onChangeValue,
      inputValue,
      shouldFocus,
      testID,
    } = this.props;

    return (
      <Box
        zIndex={10}
        position="relative"
        flexDirection="row"
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
            value: inputValue || '',
          })}
          testID={`input-tag ${testID}`}
        />
        <Box
          position="absolute"
          height="100%"
          alignItems="center"
          right={10}
          zIndex={5}
        >
          <Icon
            name={!shouldFocus ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
            color="black"
            size="md"
          />
        </Box>
      </Box>
    );
  }
}

export default InputTagInputField;
