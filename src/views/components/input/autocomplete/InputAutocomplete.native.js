import React, { Component } from 'react';
import { TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { func, string, number, oneOfType, array, bool, object } from 'prop-types';
import Downshift from 'downshift';
import { Text, Box, Input, Icon } from '../../index';

class InputAutocomplete extends Component {
  static defaultProps = {
    inputType: 'text',
    itemStringKey: 'name',
    inputProps: {},
  }

  static propTypes = {
    children: func,
    handleFilter: func,
    handleSort: func,
    inputType: string,
    value: oneOfType(
      [number, string]
    ),
    defaultValue: oneOfType(
      [number, string]
    ),
    itemStringKey: string,
    itemValueKey: string,
    items: array,
    borderBetweenItems: bool,
    onChange: func,
    onType: func,
    inputProps: object,
    width: oneOfType(
      [number, string]
    ),
    onBlur: func,
  }

  handleFilter = inputValue => dropdownItem => {
    const { itemStringKey } = this.props;

    return (
      !inputValue || (
        dropdownItem &&
        (
          /**
           * If the dropdownItem is a string, test to
           * see if it is a substring of inputValue.
           */
          typeof dropdownItem === 'string' &&
          dropdownItem.toLowerCase().includes( inputValue.toLowerCase())
        ) || (
          /**
           * If the dropdownItem is an object, test to
           * see if the string in key `itemStringKey`
           * is a substring of inputValue.
           */
          typeof dropdownItem === 'object' &&
          dropdownItem[itemStringKey] &&
          dropdownItem[itemStringKey].toLowerCase().includes( inputValue.toLowerCase())
        )
      )
    );
  }

  handleDismiss = () => {
    if ( this.props.onBlur )
      this.props.onBlur();
  }

  handleChange = item => {
    if ( this.props.onChange )
      this.props.onChange( item );
  }

  handleClearInputValue = setState => () => {
    setState({ inputValue: '' });
  }

  render() {
    const {
      inputType,
      items,
      itemStringKey,
      inputProps,
      onType,
      width,
      defaultValue,
      value,
    } = this.props;

    return (
      <Downshift
        inputValue={typeof value === 'string'
          ? value
          : value != null
            ? value[itemStringKey]
            : ''}
        defaultInputValue={value || defaultValue}
        itemToString={item => (
          item == null ? ''
          : typeof item === 'string' ? item
          : item[itemStringKey]
        )}
        onChange={this.handleChange}
        onOuterClick={this.handleOuterClick}
      >
        {({
          getRootProps,
          getItemProps,
          getInputProps,
          isOpen,
          selectedItem,
          inputValue,
          selectItem,
          openMenu,
          closeMenu,
          setState,
        }) => {
          return (
            <Box
              {...getRootProps( undefined, { suppressRefError: true })}
              width={width}
            >
              <Input
                {...inputProps}
                type={inputType}
                value={inputValue}
                enabled={false}
                onFocus={openMenu}
                width="100%"
              />

              <Modal
                visible={isOpen}
                animationType="slide"
                style={{
                  backgroundColor: 'white',
                }}
                onDismiss={this.handleDismiss}
              >
                <SafeAreaView
                  style={{
                    flex: 1,
                  }}
                >
                  <Box
                    position="relative"
                  >
                    <Box
                      position="absolute"
                      height="100%"
                      alignItems="center"
                      left={10}
                      zIndex={5}
                    >
                      <TouchableOpacity
                        onPress={closeMenu}
                      >
                        <Icon
                          name="arrow-back"
                          color="black"
                          size="md"
                        />
                      </TouchableOpacity>
                    </Box>

                    <Input
                      {...getInputProps( inputProps )}
                      type={inputType}
                      clearButtonMode="while-editing"
                      onChangeValue={onType}
                      autoFocus
                      paddingLeft={50}
                      paddingY={15}
                      icon={null}
                      width="100%"
                    />

                    {inputValue && (
                      <Box
                        position="absolute"
                        height="100%"
                        alignItems="center"
                        right={10}
                        zIndex={5}
                      >
                        <TouchableOpacity
                          onPress={this.handleClearInputValue( setState )}
                        >
                          <Icon
                            name="close"
                            color="black"
                            size="md"
                          />
                        </TouchableOpacity>
                      </Box>
                    )}
                  </Box>

                  {(
                    items &&
                    items instanceof Array &&
                    items
                      // TODO: optimize filtering so it isn't performed twice
                      .filter( this.handleFilter( inputValue ))
                      .length > 0
                  ) ? (
                      items
                        .filter( this.handleFilter( inputValue ))
                        .map( item => {
                          const idom = typeof item === 'string'
                            ? item
                            : item[itemStringKey];

                          return (
                            <TouchableOpacity
                              {...getItemProps({ item: idom })}
                              key={idom}
                              onPress={() => selectItem( item )}
                            >
                              <Box
                                padding={15}
                                borderBottomWidth={1}
                                borderColor="#DDD"
                                borderStyle="solid"
                              >
                                <Text
                                  fontWeight={selectedItem === idom ? 'bold' : 'normal'}
                                >
                                  {idom}
                                </Text>
                              </Box>
                            </TouchableOpacity>
                          );
                        })
                    ) : (
                      <Box
                        paddingX={15}
                        paddingY={10}
                      >
                        <Text>
                          No results
                        </Text>
                      </Box>
                    )}
                </SafeAreaView>
              </Modal>
            </Box>
          );
        }}
      </Downshift>
    );
  }
}

export default InputAutocomplete;
