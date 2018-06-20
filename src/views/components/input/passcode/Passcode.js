import React, { Component } from 'react';
import { number, func, oneOf, string } from 'prop-types';
import range from 'lodash.range';
import { Box, Input } from '../../../components';

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

class Passcode extends Component {
  static defaultProps = {
    numberOfInputs: 4,
    charactersRequired: 1,
    size: 'md',
    keyboardType: 'numeric',
  }

  static propTypes = {
    numberOfInputs: number,
    charactersRequired: number,
    onChangeValue: func,
    onBlur: func,
    size: oneOf(
      ['sm','md','lg']
    ),
    keyboardType: string,
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

  handleBlur = event => {
    const { numberOfInputs, onBlur, charactersRequired } = this.props;
    const { currentValues } = this.state;
    const value = Object.values( currentValues ).join( '' );

    if (
      onBlur &&
      value.length === ( numberOfInputs * charactersRequired )
    ) {
      onBlur( event );
    }
  }

  render() {
    const { numberOfInputs, charactersRequired, size, keyboardType } = this.props;
    const { currentValues } = this.state;

    return (
      <Box
        flexDirection="row"
        justifyContent="center"
      >
        {range( numberOfInputs )
          .map( i => (
            <Box
              key={i}
              width={inputWidth[size]}
              marginRight={i < numberOfInputs - 1 && 10}
            >
              <Input
                width="100%"
                type="text"
                maxLength={charactersRequired}
                value={currentValues[i] || ''}
                textSize={size}
                padding={inputPadding[size]}
                textAlign="center"
                placeholder="-"
                onChangeValue={this.handleChangeValue( i )}
                onBlur={this.handleBlur}
                ref={input => this.inputs[i] = input}
                keyboardType={keyboardType}
              />
            </Box>
          ))}
      </Box>
    );
  }
}

export default Passcode;
