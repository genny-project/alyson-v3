import React, { Component } from 'react';
import { array, func } from 'prop-types';
import { Text, Input, Box } from '../../../components';

class InputMask extends Component {  
  static defaultProps = {
    mask: ['\\d', '[0-9]', '[0-9]', { autofill: '-' }, '[0-9]', '[0-9]', '[0-9]'],
  }

  static propTypes = {
    mask: array,
    onChangeValue: func,
  }

  // static getDerivedStateFromProps( nextProps, prevState ) {
  //   if ( nextProps.value !== prevState.value ) {
  //     return { 
  //       value: nextProps.value,
  //     };
  //   }

  //   return null;
  // }
  
  state = {
    currentValue: '',
  }

  handleChangeValue = ( value ) => {
    const { onChangeValue, mask } = this.props;
    const { currentValue } = this.state;
    
    // console.log('-----------------------------------');
    
    let newValue = currentValue;

    if ( value.length < currentValue.length ) {
      newValue = value;
    }
    else {
      const isNewCharacterValid = this.checkNewValue( value, mask );
      // console.log(isNewCharacterValid);
      
      newValue = isNewCharacterValid ? value : currentValue;
    }
    
    this.setState({
      currentValue: newValue,
    }, () => {
      // console.log( onChangeValue );
      if ( onChangeValue ) onChangeValue( currentValue );
    });
  }

  checkNewValue = ( value, mask ) => {
    const arrayOfValueStrings = value.split( '' );
    // console.log( arrayOfValueStrings, mask)
    
    if (
      arrayOfValueStrings != null &&
      arrayOfValueStrings instanceof Array &&
      arrayOfValueStrings.length > 0
    ) {
      const valueLength = arrayOfValueStrings.length;
      // console.log(valueLength);
      
      if ( 
        mask != null && 
        mask instanceof Array &&
        mask.length > 0 &&
        mask.length >= valueLength
      ) {
        // console.log('test', mask[valueLength - 1]);

        const isNewValueValid = new RegExp( 
          `^${mask[valueLength - 1]}$`
        ).test(
          arrayOfValueStrings[valueLength - 1]
        );

        // console.log(isNewValueValid);

        return isNewValueValid;
      }
    }

    return false;
  }

  render() {
    const { mask, ...restProps } = this.props;
    const { currentValue } = this.state;
    // console.log('=============================');
    // console.log('rendered value', currentValue);
    
    return (
      <Box
        flexDirection="column"
      >
        <Text>
          {mask.toString()}
        </Text>
        <Input
          {...restProps}
          type="text"
          value={currentValue}
          onChangeValue={this.handleChangeValue}
          // onKeyPress={this.handleKeyPress}
        />
      </Box>
    );
  }
}

export default InputMask;
