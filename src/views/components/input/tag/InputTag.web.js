import React, { Component } from 'react';
import { object, func, array } from 'prop-types';
import { isString, isArray } from '../../../../utils';
import { Box, MultiDownshift, Input, Text, Touchable, Icon } from '../../index';

/**
 * For now, InputTag only works with an array of strings.
 */

class InputTag extends Component {
  static defaultProps = {
    inputProps: {
      placeholder: 'Add a tag...',
    },
    items: [],
  }

  static propTypes = {
    inputProps: object,
    onChangeValue: func,
    items: array,
  }

  handleChange = selectedItems => {
    if ( this.props.onChangeValue )
      this.props.onChangeValue( selectedItems );
  }

  handleFilter = ( inputValue, selectedItems ) => dropdownItem => {
    if ( selectedItems.includes( dropdownItem ))
      return false;

    if ( !inputValue )
      return true;

    if (
      isString( dropdownItem ) &&
      dropdownItem.toLowerCase().includes( inputValue.toLowerCase())
    ) {
      return true;
    }

    return false;
  }

  render() {
    const { inputProps, items } = this.props;

    return (
      <MultiDownshift
        onChange={this.handleChange}
      >
        {({
          getRootProps,
          getInputProps,
          getRemoveButtonProps,
          getItemProps,
          removeItem,
          isOpen,
          inputValue,
          selectedItems,
          highlightedIndex,
          toggleMenu,
          selectItem,
          onInputValueChange,
          clearSelection,
        }) => (
          <Box
            {...getRootProps( undefined, { suppressRefError: true })}
            flexDirection="column"
          >
            <Box
              position="relative"
              flexDirection="column"
            >
              <Box
                flexDirection="column"
                onClick={() => {
                  toggleMenu();
                  !isOpen && this.input.focus();
                }}
              >
                <Input
                  {...getInputProps({
                    ...inputProps,
                    type: 'text',
                    width: '100%',
                    ref: input => this.input = input,
                    onChangeValue: onInputValueChange,
                  })}
                />
              </Box>

              {isOpen && (
                <Box
                  flexDirection="column"
                  position="absolute"
                  backgroundColor="white"
                  top="100%"
                  left={0}
                  width="100%"
                  zIndex={20}
                  borderWidth={2}
                  borderStyle="solid"
                  borderColor="#DDD"
                  cleanStyleObject
                  maxHeight="11rem"
                  overflow="auto"
                >
                  {inputValue.length > 0 ? (
                    isArray( items ) && (
                      items
                        .filter( this.handleFilter( inputValue, selectedItems ))
                        .concat( [inputValue] )
                        .map(( item, index ) => (
                          <Touchable
                            key={item}
                            {...getItemProps({
                              item,
                              withFeedback: true,
                              onPress: () => {
                                selectItem( item );
                                clearSelection();
                              },
                            })}
                          >
                            <Box
                              padding={15}
                              borderBottomWidth={1}
                              borderColor="#DDD"
                              borderStyle="solid"
                              alignItems="center"
                            >
                              <Text
                                color={highlightedIndex === index ? 'red' : 'black'}
                                fontWeight={selectedItems.includes( item ) ? 'bold' : 'normal'}
                              >
                                {item}
                              </Text>
                            </Box>
                          </Touchable>
                        ))
                    )
                  ) : (
                    <Box
                      paddingX={15}
                      paddingY={10}
                      width="100%"
                      justifyContent="center"
                    >
                      <Text
                        align="center"
                        color="grey"
                        size="xs"
                      >
                        {inputValue.length > 0
                          ? 'No results'
                          : 'Please type...'
                        }
                      </Text>
                    </Box>
                  )}
                </Box>
              )}
            </Box>

            <Box
              flexWrap="wrap"
              marginTop={10}
            >
              {selectedItems.length > 0 && (
                selectedItems.map( item => (
                  <Box
                    key={item}
                    backgroundColor="#CCC"
                    alignItems="center"
                    marginRight={10}
                    marginBottom={10}
                    cleanStyleObject
                  >
                    <Box marginLeft={5}>
                      <Text color="black">
                        {item}
                      </Text>
                    </Box>

                    <Touchable
                      {...getRemoveButtonProps({
                        withFeedback: true,
                        onPress: () => {
                          removeItem( item );
                        },
                        style: {
                          padding: 10,
                        },
                      })}
                    >
                      <Icon
                        type="material-icons"
                        name="clear"
                        color="black"
                      />
                    </Touchable>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        )}
      </MultiDownshift>
    );
  }
}

export default InputTag;
