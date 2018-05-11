import React, { Component } from 'react';
import { Picker } from 'react-native';
import { oneOfType, arrayOf, string, any, shape } from 'prop-types';

class InputDropdown extends Component {
  static propTypes = {
    items: oneOfType(
      [
        arrayOf( string ),
        arrayOf(
          shape({
            label: string,
            value: any,
          })
        ),
      ]
    ).isRequired,
  }

  render() {
    const { items } = this.props;

    return (
      <Picker>
        {(
          items &&
          items instanceof Array &&
          items.length > 0
        ) ? (
          items.map( item => (
            <Picker.Item
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))
        ) : (
          <Picker.Item label="No items to show" />
        )}
      </Picker>
    );
  }
}

export default InputDropdown;
