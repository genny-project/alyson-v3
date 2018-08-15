import React, { Component } from 'react';
import { Modal } from 'react-native';
import { isString } from '../../../../utils';
import { Box, MultiDownshift, Input, Text, SafeAreaView, Touchable, Icon } from '../../index';

const items = [
  'One',
  'Two',
  'THree',
  'FOur',
  'five',
  'six',
  'Seve',
  'Eight',
  'nine',
  'ten',
];

class InputTag extends Component {
  input = React.createRef()
  itemToString = item => ( item ? item.name : '' )
  handleChange = selectedItems => {
    console.log({ selectedItems });
  }

  handleFilter = inputValue => dropdownItem => {
    return !inputValue || (
      isString( dropdownItem ) &&
      dropdownItem.toLowerCase().includes( inputValue.toLowerCase())
    );
  }

  render() {
    return (
      <MultiDownshift
        onChange={this.handleChange}
        itemToString={this.itemToString}
      >
        {({
          getRootProps,
          getInputProps,
          // getToggleButtonProps,
          // getMenuProps,
          // getRemoveButtonProps,
          getItemProps,
          removeItem,
          isOpen,
          inputValue,
          selectedItems,
          highlightedIndex,
          toggleMenu,
          selectItem,
        }) => (
          <Box
            {...getRootProps( undefined, { suppressRefError: true })}
            flexDirection="column"
          >
            <Touchable
              withFeedback
              onPress={toggleMenu}
              style={{
                width: '100%',
                position: 'relative',
              }}
            >
              <Input
                type="text"
                editable={false}
                width="100%"
                padding={15}
                placeholder="Add a tag..."
              />

              <Box
                width="100%"
                height="100%"
                position="absolute"
                top={0}
                left={0}
              />
            </Touchable>

            <Box backgroundColor="red">
              {selectedItems.length > 0
                ? selectedItems.map( item => (
                  <Box
                    key={item}
                    backgroundColor="grey"
                  >
                    <Box marginRight={10}>
                      <Text>
                        {item}
                      </Text>
                    </Box>

                    <Touchable
                      withFeedback
                      onPress={() => removeItem( item )}
                      style={{ padding: 10 }}
                    >
                      <Text>
                        X
                      </Text>
                    </Touchable>
                  </Box>
                ))
                : (
                  <Text>
                  No items to show
                  </Text>
                )}
            </Box>

            <Modal
              visible={isOpen}
              animationType="slide"
              style={{
                backgroundColor: 'white',
              }}
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
                    <Touchable
                      withFeedback
                      onPress={toggleMenu}
                    >
                      <Icon
                        name="arrow-back"
                        color="black"
                        size="md"
                      />
                    </Touchable>
                  </Box>

                  <Input
                    {...getInputProps()}
                    type="text"
                    clearButtonMode="while-editing"
                    autoFocus
                    paddingLeft={50}
                    paddingY={15}
                    width="100%"
                    backgroundColor="transparent"
                    borderBottomWidth={2}
                    borderColor="#DDD"
                    borderStyle="solid"
                  />

                  {inputValue ? (
                    <Box
                      position="absolute"
                      height="100%"
                      alignItems="center"
                      right={10}
                      zIndex={5}
                    >
                      <Touchable
                        withFeedback
                      >
                        <Icon
                          name="close"
                          color="black"
                          size="md"
                        />
                      </Touchable>
                    </Box>
                  ) : null}
                </Box>

                {(
                  items &&
                    items instanceof Array &&
                    items
                      // TODO: optimize filtering so it isn't performed twice (state?)
                      .filter( this.handleFilter( inputValue ))
                      .length > 0
                ) ? (
                    items
                        .filter( this.handleFilter( inputValue ))
                        .map(( item, index ) => {
                          return (
                            <Touchable
                              {...getItemProps({ item })}
                              key={item}
                              onPress={() => selectItem( item )}
                              withFeedback
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
                                  fontWeight={(
                                    selectedItems.includes( item )
                                  ) ? 'bold' : 'normal'}
                                >
                                  {item}
                                </Text>
                              </Box>
                            </Touchable>
                          );
                        })
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
                          : 'Please enter an address above'
                          }
                      </Text>
                    </Box>
                  )}
              </SafeAreaView>
            </Modal>
          </Box>
        )}
      </MultiDownshift>
    );
  }
}

export default InputTag;
