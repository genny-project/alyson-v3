import React, { Component } from 'react';
import { number, func, oneOf } from 'prop-types';
import range from 'lodash.range';
import { Box, Input } from '../../../components';

class Passcode extends Component {  
  static defaultProps = {
    numberOfInputs: 4,
    charactersRequired: 1,
    size: 'md',
  }

  static propTypes = {
    numberOfInputs: number,
    charactersRequired: number,
    onChangeValue: func,
    size: oneOf(
      ['sm','md','lg']
    ),
  }

  // static getDerivedStateFromProps( nextProps, prevState ) {
  //   if ( nextProps.value !== prevState.value ) {
  //     return { 
  //       value: nextProps.value,
  //     };
  //   }

  //   return null;
  // }
  
  inputs = {};

  state = {
    currentValues: {},
  }

  handleChangeValue = ( index ) => ( data ) => {
    this.setState( prevState => ({
      currentValues: {
        ...prevState.currentValues,
        [index]: data,
      },
    }), () => {
      if (
        this.inputs[index] &&
        !this.inputs[index + 1] &&
        index === this.props.numberOfInputs - 1
      ) {
        this.inputs[index].blur();
        this.handleComplete();
      }
      else if ( data.length >= this.props.charactersRequired ) {
        this.inputs[index + 1].focus();
      }
    });
  }

  handleComplete = () => {
    const { numberOfInputs, onChangeValue, charactersRequired } = this.props;
    const { currentValues } = this.state;
    const value = Object.values( currentValues ).join( '' );
    
    if (
      onChangeValue &&
      value.length === ( numberOfInputs * charactersRequired )
    ) {
      onChangeValue( value );
    }
  }

  render() {
    const { numberOfInputs, charactersRequired, size } = this.props;
    const { currentValues } = this.state;

    const inputWidth = {
      sm: 30,
      md: 50,
      lg: 70,
    };

    const inputPadding = {
      sm: 5,
      md: 10,
      lg: 20,
    };

    return (
      <Box
        flexDirection="row"
        justifyContent="center"
      >
        {
          range( numberOfInputs )
            .map( i => (
              <Box
                key={i}
                width={inputWidth[size]}
              >
                <Input
                  width="100%"
                  forwardedRef={input => this.inputs[i] = input}
                  type="text"
                  maxLength={charactersRequired}
                  value={currentValues[i] || ''}
                  textSize={size}
                  padding={inputPadding[size]}
                  textAlign="center"
                  placeholder="-"
                  onChangeValue={this.handleChangeValue( i )}
                />
              </Box>
            ))
          }
      </Box>
    );
  }
}

export default Passcode;
