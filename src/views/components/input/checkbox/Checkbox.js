import React, { Component } from 'react';
import { array, bool, func, string, oneOfType } from 'prop-types';
import { CheckBox as NativeCheckBox, TouchableOpacity } from 'react-native';
import { Box, Text } from '../../../components';

class CheckBox extends Component {  
  static defaultProps = {
    items: ['aggrieve', 'abscond', 'acquiesce', 'acquire'],
    value: [],
    horizontal: false,
    radio: false,
  }

  static propTypes = {
    items: array,
    value: oneOfType(
      [array, string]
    ),
    horizontal: bool,
    onChangeValue: func,
    radio: bool,
  }

  static getDerivedStateFromProps( nextProps, prevState ) {
    if ( nextProps.value !== prevState.value ) {
      return { value: nextProps.value };
    }

    return null;
  }

  state = {
    value: this.props.value,
  }

  handleValueChange = item => () => {
    this.setState( state => {
      if ( this.props.radio !== true ) {
        if ( state.value.includes( item )) {
          return {
            value: state.value.filter( i => i !== item ),
          };
        }
  
        return {
          value: [...state.value, item],
        };  
      }

      return {
        value: item,
      };
    }, () => {
      if ( this.props.onChangeValue ) this.props.onChangeValue( this.state.value );
    });
  }

  render() {
    const { items, horizontal, radio } = this.props;
    const { value } = this.state;

    return (
      <Box
        flexDirection={
          horizontal
            ? 'row'
            : 'column'
        }
      >
        {(
          items &&
          items instanceof Array &&
          items.length > 0 
        ) ? (
            items.map(( item ) => {
              return (
                <Box
                  key={item}
                  flexDirection="row"
                  alignItems="center"
                  padding={5}
                > 
                  <NativeCheckBox 
                    style={{ marginRight: 5, height: 20, width: 20 }}
                    color="black"
                    value={(
                      radio
                        ? value === item
                        : value.includes( item )
                    )}
                    onValueChange={this.handleValueChange( item )}
                  />
                  <TouchableOpacity
                    onPress={this.handleValueChange( item )}
                  >
                    <Text>
                      {item}
                    </Text>
                  </TouchableOpacity>
                </Box>
              );
            })
          ) : null
        }
        
      </Box>
    );
  }
}

export default CheckBox;
