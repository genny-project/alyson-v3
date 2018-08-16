import React, { Component } from 'react';
import { Modal } from 'react-native';
import { object, func, array } from 'prop-types';
import { isString, isArray } from '../../../../utils';
import { Box, MultiDownshift, Input, Text, SafeAreaView, Touchable, Icon } from '../../index';

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
    const { items, inputProps } = this.props;

    return (
      <MultiDownshift
        onChange={this.handleChange}
        itemToString={this.itemToString}
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
            <Touchable
              withFeedback
              onPress={toggleMenu}
              style={{
                width: '100%',
                position: 'relative',
              }}
            >
              <Input
                {...inputProps}
                type="text"
                editable={false}
                width="100%"
                onChangeValue={onInputValueChange}
              />

              <Box
                width="100%"
                height="100%"
                position="absolute"
                top={0}
                left={0}
              />
            </Touchable>

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
                        onPress: () => removeItem( item ),
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
                    {...getInputProps({
                      type: 'text',
                      clearButtonMode: 'while-editing',
                      autoFocus: true,
                      paddingLeft: 50,
                      paddingY: 15,
                      width: '100%',
                      backgroundColor: 'transparent',
                      borderBottomWidth: 2,
                      borderColor: '#DDD',
                      borderStyle: 'solid',
                    })}
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
                        onPress={clearSelection}
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

                {inputValue.length > 0 ? (
                  isArray( items ) ? (
                    items
                    .filter( this.handleFilter( inputValue ))
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
                  )
                ) : null}
              </SafeAreaView>
            </Modal>
          </Box>
        )}
      </MultiDownshift>
    );
  }
}

export default InputTag;
