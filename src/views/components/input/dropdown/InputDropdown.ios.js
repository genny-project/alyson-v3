import React, { Component, Fragment } from 'react';
import { TouchableOpacity, Modal, Picker, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { oneOfType, arrayOf, string, any, shape, number, func, bool } from 'prop-types';
import { Box, Text, Input, Touchable } from '../../index';

class InputDropdown extends Component {
  static defaultProps = {
    itemStringKey: 'label',
    itemValueKey: 'value',
    itemIdKey: 'id',
  }

  static propTypes = {
    value: any,
    onChange: func,
    onChangeValue: func,
    onBlur: func,
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
    if ( value === 'SELECT_AN_OPTION' )
      return false;

    this.setState({ value });

    if ( this.props.onChange )
      this.props.onChange( value );

    if ( this.props.onChangeValue )
      this.props.onChangeValue( value );
  }

  handleClose = () => {
    this.setState({ isOpen: false });

    if ( this.props.onBlur )
      this.props.onBlur();
  }

  handleToggle = () => {
    const { disabled, items } = this.props;

    if (
      disabled ||
      items == null &&
      !( items instanceof Array ) &&
      items.length === 0
    ) {
      return false;
    }

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
        <Touchable
          withFeedback
          onPress={this.handleToggle}
          style={{
            width: '100%',
            position: 'relative',
          }}
        >
          <Input
            type="text"
            value={value}
            placeholder={validItems ? 'Select an option...' : 'No items to select'}
            icon="expand-more"
            disabled={!validItems && !disabled}
            editable={false}
          />

          <Box
            width="100%"
            height="100%"
            position="absolute"
            top={0}
            left={0}
          />
        </Touchable>

        <Modal
          visible={isOpen}
          animationType="slide"
          transparent
        >
          <SafeAreaView
            style={{
              flex: 1,
            }}
          >
            <TouchableWithoutFeedback
              onPress={this.handleClose}
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                height="100%"
                width="100%"
              />
            </TouchableWithoutFeedback>

            <Box
              height="40%"
              width="100%"
              position="absolute"
              bottom={0}
              left={0}
              backgroundColor="white"
              flexDirection="column"
            >
              <Box
                justifyContent="flex-end"
                alignItems="center"
                borderTopWidth={1}
                borderBottomWidth={1}
                borderStyle="solid"
                borderColor="grey"
                paddingX={5}
              >
                <TouchableOpacity
                  onPress={this.handleClose}
                >
                  <Box padding={10}>
                    <Text fontWeight="bold">
                      Done
                    </Text>
                  </Box>
                </TouchableOpacity>
              </Box>

              <Box
                justifyContent="center"
                alignItems="center"
                flex={1}
                height="100%"
              >
                <Picker
                  enabled={validItems && !disabled}
                  onValueChange={this.handleChange}
                  selectedValue={value}
                  style={{
                    width: '100%',
                  }}
                >
                  <Picker.Item
                    label="Select an option"
                    value="SELECT_AN_OPTION"
                  />

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
            </Box>
          </SafeAreaView>
        </Modal>
      </Fragment>
    );
  }
}

export default InputDropdown;
