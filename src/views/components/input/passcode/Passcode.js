import React, { Component } from 'react';
import { number, func, oneOf, string, bool } from 'prop-types';
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
    caseSensitive: false,
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
    caseSensitive: bool,
  }

  // static getDerivedStateFromProps( nextProps, prevState ) {
  //   if (
  //     nextProps.value !== null &&
  //     nextProps.value !== prevState.value &&
  //     isString( nextProps.value )
  //   ) {
  //     const splitIntoParts = ( string, splitLength ) => {
  //       var list = [];

  //       for ( var i = 0; i < string.length; i += splitLength ) {
  //         list.push( string.substr( i, Math.min( splitLength, string.length )));
  //       }

  //       return list;
  //     };

  //     const value = splitIntoParts( nextProps.value, this.props.charactersRequired );
  //     console.log(value);

  //     value.map(( characters, index ) => {
  //       return {
  //         [index]: characters,
  //       };
  //     });
  //     console.log( value );

  //     return {
  //       currentValues: value,
  //     };
  //   }

  //   return null;
  // }

  inputs = {};

  state = {
    currentValues: {},
    lastSentValue: null,
  }

  handleChangeValue = ( index ) => ( data ) => {
    const { charactersRequired, caseSensitive } = this.props;

    let inputValue = data.toString();

    if ( !caseSensitive ) {
      inputValue = inputValue.toUpperCase();
    }

    if ( inputValue.length > charactersRequired ) {
      inputValue = inputValue.substr( inputValue.length - charactersRequired, charactersRequired );
    }

    this.setState( prevState => ({
      currentValues: {
        ...prevState.currentValues,
        [index]: inputValue,
      },
    }), () => {
      if (
        this.inputs[index] &&
        !this.inputs[index + 1] &&
        index === this.props.numberOfInputs - 1 &&
        inputValue.length === charactersRequired
      ) {
        this.inputs[index].blur();
        this.handleComplete();
      }
      else if ( inputValue.length >= charactersRequired ) {
        this.inputs[index + 1].focus();
      }
    });
  }

  handleComplete = () => {
    const { numberOfInputs, onChangeValue, charactersRequired } = this.props;
    const { currentValues, lastSentValue } = this.state;
    const value = Object.values( currentValues ).join( '' );

    if (
      onChangeValue &&
      value.length === ( numberOfInputs * charactersRequired ) &&
      value !== lastSentValue
    ) {
      this.setState({
        lastSentValue: value,
      }, () => {
        onChangeValue( value );
      });
    }
  }

  // handleBlur = event => {
  //   const { numberOfInputs, onBlur, charactersRequired } = this.props;
  //   const { currentValues, lastSentValue } = this.state;
  //   const value = Object.values( currentValues ).join( '' );

  //   if (
  //     onBlur &&
  //     value.length === ( numberOfInputs * charactersRequired ) &&
  //     value !== lastSentValue
  //   ) {
  //     console.log( 'blur', value, lastSentValue );
  //     this.setState({
  //       lastSentValue: value,
  //     }, () => {
  //       onBlur( event );
  //     });
  //   }
  // }

  render() {
    const { numberOfInputs, size, keyboardType, ...restProps } = this.props;
    const { currentValues } = this.state;

    return (
      <Box
        flexDirection="row"
        justifyContent="center"
      >
        {range( numberOfInputs )
          .map( i => {
            const marginRight = i < numberOfInputs - 1
              ? {
                marginRight: 10,
              }
              : {};

            return (
              <Box
                key={i}
                width={inputWidth[size]}
                {...marginRight}
              >
                <Input
                  {...restProps}
                  width="100%"
                  type="text"
                  value={currentValues[i] || ''}
                  textSize={size}
                  padding={inputPadding[size]}
                  textAlign="center"
                  placeholder="-"
                  onChangeValue={this.handleChangeValue( i )}
                  onBlur={this.handleBlur}
                  ref={input => this.inputs[i] = input}
                  keyboardType={keyboardType}
                  autoCapitalize
                />
              </Box>
            );
          })}
      </Box>
    );
  }
}

export default Passcode;
