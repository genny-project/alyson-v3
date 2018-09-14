import React, { Component, Fragment } from 'react';
import { Picker } from 'react-native';
import { oneOfType, arrayOf, string, any, shape, number, func, bool } from 'prop-types';
import { isArray, isObject } from '../../../../utils';

class InputDropdown extends Component {
  static defaultProps = {
    itemStringKey: 'label',
    itemValueKey: 'value',
    itemIdKey: 'id',
  }

  static propTypes = {
    value: any,
    onChangeValue: func,
    itemStringKey: string,
    itemValueKey: string,
    itemIdKey: string,
    placeholder: string,
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
    const { placeholder } = this.props;

    if ( value === placeholder )
      return;

    this.setState({ value });

    if ( this.props.onChangeValue )
      this.props.onChangeValue( value );
  }

  render() {
    const {
      items,
      itemStringKey,
      itemValueKey,
      itemIdKey,
      disabled,
      placeholder,
      ...restProps
    } = this.props;

    const { value } = this.state;

    const validItems = isArray( items, { ofMinLength: 1 });

    return (
      <Picker
        {...restProps}
        enabled={!disabled && validItems}
        onValueChange={this.handleChange}
        selectedValue={value}
      >
        {validItems ? (
          <Fragment>
            {placeholder ? (
              <Picker.Item
                label={placeholder}
                disabled
                hidden
              />
            ) : null}

            {items.map( item => {
              const isItemObject = isObject( item );

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
            })}
          </Fragment>
        ) : (
          <Picker.Item
            label="No items to show"
            hidden
          />
        )}
      </Picker>
    );
  }
}

export default InputDropdown;
