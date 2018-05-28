import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { Text, Input, Box } from '../../../components';

class InputMask extends Component {  
  static defaultProps = {
    mask: null,
    // mask: '\\d,\\d,\\d,\\d,-,\\d,\\d,\\d,\\d,-,\\d,\\d,\\d,\\d,-,\\d,\\d,\\d,\\d',
  }

  static propTypes = {
    mask: string,
    value: string,
    onChangeValue: func,
  }

  static getDerivedStateFromProps( nextProps, prevState ) {
    if ( nextProps.value !== prevState.value ) {
      return { 
        currentValue: nextProps.value,
      };
    }

    return null;
  }
  
  state = {
    currentValue: '',
  }

  getValue = ( newValue, currentValue, mask ) => {
    if (
      mask === null ||
      (
        mask !== null &&
        typeof mask === 'string' &&
        mask.length === 0
      ) ||
      (
        newValue != null &&
        newValue.length === 0
      )
    ) {
      return newValue;
    }
    const inputMask = mask.split( ',' ).map( characterMask => {
      if ( characterMask.indexOf( 'd' ) === 1 || characterMask.indexOf( 'w' ) === 1 ) {
        return new RegExp( characterMask );
      }

      return { autofill: characterMask };
    });

    const valueArray = newValue.split( '' );
    
    if (
      valueArray != null &&
      valueArray instanceof Array &&
      valueArray.length > 0
    ) {
      let valueLength = valueArray.length;
      
      if ( 
        inputMask != null && 
        inputMask instanceof Array &&
        inputMask.length > 0 &&
        inputMask.length >= valueLength
      ) {
        if (
          newValue.length > currentValue.length &&
          inputMask[valueLength] &&
          inputMask[valueLength].autofill
        ) {
          valueArray.push( inputMask[valueLength].autofill );
          valueLength = valueArray.length;
        }
        else if (
          newValue.length < currentValue.length &&
          inputMask[valueLength] && 
          inputMask[valueLength].autofill
        ) {
          valueArray.pop();
          valueLength = valueArray.length;
        }

        const isNewValueValid = valueArray.every(( maskCharacter, index ) => {
          if (
            inputMask[index] &&
            inputMask[index].autofill
          ) {
            return true;
          }
          const isValid = new RegExp( 
            inputMask[index]
          ).test(
            valueArray[index]
          );
          
          return isValid;
        });
        
        return isNewValueValid ? valueArray.join( '' ) : currentValue;
      }
    }

    return currentValue;
  }

  handleChangeValue = ( value ) => {
    const { onChangeValue, mask } = this.props;
    const { currentValue } = this.state;
    
    const newValue = this.getValue( value, currentValue, mask );
    
    this.setState({
      currentValue: newValue,
    }, () => {
      if ( onChangeValue ) onChangeValue( currentValue );
    });
  }

  render() {
    const { mask, ...restProps } = this.props;
    const { currentValue } = this.state;
    
    return (
      <Box
        flexDirection="column"
      >
        { 
          mask !== null &&
          typeof mask === 'string' &&
          mask.length > 0 &&
          (
            <Text>
              {mask.toString()}
            </Text>
          )  
        }
        <Input
          {...restProps}
          type="text"
          value={currentValue}
          onChangeValue={this.handleChangeValue}
        />
      </Box>
    );
  }
}

export default InputMask;
