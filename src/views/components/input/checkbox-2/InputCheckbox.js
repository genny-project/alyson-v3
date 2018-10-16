import React, { Component } from 'react';
import { array, func } from 'prop-types';
import { isArray } from '../../../../utils';
import { Box, Text, Input } from '../../index';

class Checkbox extends Component {
  static defaultProps = {
    value: [],
  }

  static propTypes = {
    items: array,
    value: array,
    onChangeValue: func,
  }

  static getDerivedStateFromProps( nextProps, nextState ) {
    if (
      nextProps.value != null &&
      nextProps.value !== nextState.selected
    ) {
      return { selected: nextProps.value };
    }

    return null;
  }

  state = {
    selected: this.props.value,
  }

  handleChange = value => () => {
    this.setState( state => {
      if ( state.selected.includes( value )) {
        return { selected: state.selected.filter( item => item !== value ) };
      }

      return { selected: [value, ...state.selected] };
    }, () => {
      console.warn( 'hello', this.state.selected, this.props );

      if ( this.props.onChangeValue ) {
        this.props.onChangeValue( this.state.selected );
      }
    });
  }

  render() {
    const { items } = this.props;
    const { selected } = this.state;

    console.warn({ selected, items });

    return (
      <Box
        flexDirection="column"
        marginTop={10}
        testID="input-checkbox"
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

export default Checkbox;
