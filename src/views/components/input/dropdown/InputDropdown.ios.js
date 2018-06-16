import React, { Component, Fragment } from 'react';
import { Modal, Picker, SafeAreaView } from 'react-native';
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

  static getDerivedStateFromProps( props, state ) {
    /* If the props for value changes... */
    if (
      props.value != null &&
      props.value !== state.value
    ) {
      /* And if the state for value is an object... */
      if (
        state.value != null &&
        !( state.value instanceof Array ) &&
        typeof state.value === 'object'
      ) {
        /* As well as if the props value is a string... */
        if ( typeof props.value === 'string' ) {
          const valueObject = props.items.find( item => item.value === props.value );

          return { value: valueObject };
        }

        /* If props value is an object, we can safely update it. */
        if (
          !( props.value instanceof Array ) &&
          typeof props.value === 'object'
        ) {
          return { value: props.value };
        }
      }

      /* If they're both string, simply update the state. */
      if (
        typeof props.value === 'string' &&
        typeof state.value === 'string'
      ) {
        return { value: props.value };
      }
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

    const { items, itemValueKey } = this.props;

    const itemsContainsObjects = (
      items[0] != null &&
      !( items[0] instanceof Array ) &&
      typeof items[0] === 'object'
    );

    const adjustedValue = (
      itemsContainsObjects
        ? items.find( item => item[itemValueKey] === value )
        : value
    );

    this.setState({ value: adjustedValue });

    if ( this.props.onChange )
      this.props.onChange({ target: { value: adjustedValue[itemValueKey] } });

    if ( this.props.onChangeValue )
      this.props.onChangeValue( adjustedValue[itemValueKey] );
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
    const { items, itemStringKey, itemValueKey, itemIdKey, disabled, ...restProps } = this.props;
    const { value, isOpen } = this.state;

    const validItems = (
      items != null &&
      items instanceof Array &&
      items.length > 0
    );

    const isValueObject = (
      value != null &&
      !( value instanceof Array ) &&
      typeof value === 'object'
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
            {...restProps}
            type="text"
            value={(
              isValueObject
                ? value[itemStringKey]
                : value
            )}
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
            <Touchable
              onPress={this.handleClose}
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                height="100%"
                width="100%"
              />
            </Touchable>

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
                <Touchable
                  withFeedback
                  onPress={this.handleClose}
                >
                  <Box padding={10}>
                    <Text fontWeight="bold">
                      Done
                    </Text>
                  </Box>
                </Touchable>
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
                  selectedValue={(
                    isValueObject
                      ? value[itemValueKey]
                      : value
                  )}
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
