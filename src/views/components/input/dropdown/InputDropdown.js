import React, { Component } from 'react';
import { Picker } from 'react-native';
import { oneOfType, arrayOf, string, any, shape, number, func, bool } from 'prop-types';

class InputDropdown extends Component {
  static defaultProps = {
    itemStringKey: 'label',
    itemValueKey: 'value',
    itemIdKey: 'id',
  }

  static propTypes = {
    value: any,
    onChange: func,
    itemStringKey: string,
    itemValueKey: string,
    itemIdKey: string,
    disabled: bool,
    items: oneOfType(
      [
        arrayOf( string ),
        arrayOf(
          shape({
            label: string.isRequired,
            value: oneOfType(
              [number, string]
            ).isRequired,
            color: string,
            testID: string,
          })
        ),
      ]
    ).isRequired,
  }

  static getDerivedStateFromProps( nextProps, nextState ) {
    if (
      nextProps.value != null &&
      nextProps.value !== nextState.value
    ) {
      return { value: nextProps.value };
    }

    return null;
  }

  state = {
    value: this.props.value,
  }

  handleChange = value => {
    this.setState({ value });

    if ( this.props.onChange )
      this.props.onChange( value );
  }

  render() {
    const { items, itemStringKey, itemValueKey, itemIdKey, disabled } = this.props;
    const { value } = this.state;

    const validItems = (
      items != null &&
      items instanceof Array &&
      items.length > 0
    );

    return (
      <Picker
        enabled={!disabled && validItems}
        onValueChange={this.handleChange}
        selectedValue={value}
      >
        {validItems ? (
          items.map( item => {
            const isItemObject = (
              item != null &&
              typeof item === 'object'
            );

            return (
              <Picker.Item
                key={(
                  isItemObject
                    ? ( item[itemIdKey] || item[itemStringKey] )
                    : item
                )}
                label={isItemObject ? item[itemStringKey] : item}
                value={isItemObject ? item[itemValueKey] : item}
              />
            );
          })
        ) : (
          <Picker.Item label="No items to show" hidden />
        )}
      </Picker>
    );
  }
}

export default InputDropdown;
