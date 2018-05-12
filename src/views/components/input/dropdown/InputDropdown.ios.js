import React, { Component, Fragment } from 'react';
import { TouchableOpacity, Modal, Picker } from 'react-native';
import { oneOfType, arrayOf, string, any, shape, number, func, bool } from 'prop-types';
import { Box, Text } from '../../index';

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
    isOpen: false,
  }

  handleChange = value => {
    this.setState({ value });

    if ( this.props.onChange )
      this.props.onChange( value );
  }

  handleToggle = () => {
    this.setState( state => ({ isOpen: !state.isOpen }));
  }

  render() {
    const { items, itemStringKey, itemValueKey, itemIdKey, disabled } = this.props;
    const { value, isOpen } = this.state;

    const validItems = (
      items != null &&
      items instanceof Array &&
      items.length > 0
    );

    return (
      <Fragment>
        <TouchableOpacity
          disabled={!validItems && !disabled}
          onPress={this.handleToggle}
        >
          <Box
            height={50}
            width={200}
          >
            <Text>
              {value || 'Select an option'}
            </Text>
          </Box>
        </TouchableOpacity>

        <Modal
          visible={isOpen}
          animationType="slide"
          presentationStyle="formSheet"
        >
          <Box>
            <Picker
              enabled={validItems && !disabled}
              onValueChange={this.handleChange}
              selectedValue={value}
              style={{
                height: '100%',
                width: '100%',
              }}
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
              ) : null}
            </Picker>
          </Box>
        </Modal>
      </Fragment>
    );
  }
}

export default InputDropdown;
