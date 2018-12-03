import React, { Component } from 'react';
import { array, func, string } from 'prop-types';
import { isArray } from '../../../../utils';
import { Box, Text, Input } from '../../index';

class InputCheckbox extends Component {
  static defaultProps = {
    value: [],
    testID: 'input-checkbox',
  }

  static propTypes = {
    items: array,
    value: array,
    onChangeValue: func,
    testID: string,
  }

  state = {
    selected: this.props.value,
  }

  handleChange = value => () => {
    this.setState( state => {
      if ( state.selected.includes( value )) {
        return { selected: state.selected.filter( item => item !== value ) };
      }

      return { selected: [...state.selected, value] };
    }, () => {
      if ( this.props.onChangeValue ) {
        this.props.onChangeValue( this.state.selected );
      }
    });
  }

  render() {
    const { items, testID } = this.props;
    const { selected } = this.state;

    return (
      <Box
        flexDirection="column"
        marginTop={10}
        testID={testID}
      >
        {isArray( items, { ofMinLength: 1 }) ? (
          items.map( item => (
            <Box
              key={item.value}
              alignItems="center"
              marginBottom={10}
            >
              <Box marginRight={15}>
                <Input
                  type="switch"
                  value={selected.includes( item.value )}
                  onChangeValue={this.handleChange( item.value )}
                />
              </Box>

              <Text
                size="md"
              >
                {item.label}
              </Text>
            </Box>
          ))
        ) : (
          <Text>
            No items to show
          </Text>
        )}
      </Box>
    );
  }
}

export default InputCheckbox;
