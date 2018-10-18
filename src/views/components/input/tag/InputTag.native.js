import React, { Component } from 'react';
import { Modal } from 'react-native';
import { string, func, array, bool, object } from 'prop-types';
import { isString, isArray, isObject } from '../../../../utils';
import { LayoutConsumer } from '../../../layout';
import { Box, MultiDownshift, Input, Text, SafeAreaView, Touchable, Icon, Recursive } from '../../index';

class InputTag extends Component {
  static defaultProps = {
    placeholder: 'Add a tag...',
    items: [],
    itemStringKey: 'label',
    itemValueKey: 'value',
    itemIdKey: 'id',
    allowNewTags: true,
  }

  static propTypes = {
    placeholder: string,
    onChangeValue: func,
    items: array,
    itemStringKey: string,
    itemValueKey: string,
    itemIdKey: string,
    value: array,
    allowNewTags: bool,
    allowMultipleSelection: bool,
    tagsWrapperProps: object,
    renderTag: object,
    renderSuggestion: object,
  }

  state = { preSelected: [] }

  handleChange = selectedItems => {
    if ( this.props.onChangeValue ) {
      this.props.onChangeValue( selectedItems.map( i => i[this.props.itemValueKey]
        ? i[this.props.itemValueKey]
        : i
      ));
    }
  }

  handleFilter = ( inputValue, selectedItems ) => dropdownItem => {
    const { itemStringKey } = this.props;
    const itemString = isObject( dropdownItem ) ? dropdownItem[itemStringKey] : dropdownItem;

    if ( selectedItems && selectedItems.includes( itemString ))
      return false;

    if ( !dropdownItem )
      return true;

    if ( !inputValue )
      return true;

    if (
      isString( itemString ) &&
      itemString.toLowerCase().includes( inputValue.toLowerCase())
    ) {
      return true;
    }

    return false;
  }

  addItemToPreSelection = ( item ) => {
    const { itemValueKey } = this.props;

    this.setState(
      ({ preSelected }) => ({
        preSelected: preSelected.filter( i => i[itemValueKey] === item[itemValueKey] ).length > 0
          ? preSelected.filter( i => i[itemValueKey] !== item[itemValueKey] )
          : [...preSelected, item],
      })
    );
  }

  removeItemToPreSelection = ( item ) => {
    const { itemValueKey } = this.props;

    this.setState(
      ({ preSelected }) => ({
        preSelected: preSelected.filter( i => i[itemValueKey] !== item[itemValueKey] ),
      })
    );
  }

  render() {
    const {
      items,
      value,
      itemStringKey,
      itemValueKey,
      allowNewTags,
      allowMultipleSelection,
      tagsWrapperProps,
      renderTag,
      renderSuggestion,
      ...restProps
    } = this.props;

    return (
      <MultiDownshift
        onChange={this.handleChange}
        itemToString={this.itemToString}
        selectedItems={isArray( value )
          ? value.map( i => isObject( i ) ? i
          : { [itemStringKey]: i, [itemValueKey]: i }) : null
        }
        addItemFunction={(( selectedItems, newItem ) => (
          selectedItems.filter( i => (
            newItem != null &&
            i[itemValueKey] === newItem[itemValueKey] )).length === 0
            ? [...selectedItems, newItem]
            : selectedItems
        ))}
        removeItemFunction={(( selectedItems, newItem ) => (
          selectedItems.filter( i => i[itemValueKey] !== newItem[itemValueKey] )
        ))}
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
          selectMultipleItems,
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
                {...restProps}
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
              {...tagsWrapperProps}
            >
              {selectedItems.length > 0 && (
                selectedItems.map( item => {
                  const itemString = isObject( item ) ? item[itemStringKey] : item;
                  const itemId = isObject( item ) ? item[itemValueKey] : item;

                  if ( renderTag ) {
                    return (
                      <LayoutConsumer>
                        {layout => {
                          const context = {
                            item: {
                              [itemStringKey]: itemString,
                              [itemValueKey]: itemId,
                            },
                            layout,
                            onPress: () => {
                              removeItem({
                                [itemStringKey]: itemString,
                                [itemValueKey]: itemId,
                              });
                              this.removeItemToPreSelection({
                                [itemStringKey]: itemString,
                                [itemValueKey]: itemId,
                              });
                            },
                          };

                          return (
                            <Recursive
                              {...renderTag}
                              context={context}
                            />
                          );
                        }}
                      </LayoutConsumer>
                    );
                  }

                  return (
                    <Box
                      key={itemId}
                      alignItems="center"
                      marginRight={10}
                      marginBottom={10}
                      borderWidth={2}
                      borderRadius={20}
                      borderColor="grey"
                      paddingLeft={10}
                      paddingRight={5}
                      cleanStyleObject
                    >
                      <Box marginLeft={5}>
                        <Text color="#grey">
                          {itemString}
                        </Text>
                      </Box>

                      <Touchable
                        {...getRemoveButtonProps({
                          withFeedback: true,
                          onPress: () => {
                            removeItem( item,  );
                            this.removeItemToPreSelection( item );
                          },
                          style: {
                            padding: 10,
                          },
                        })}
                      >
                        <Icon
                          type="material-icons"
                          name="clear"
                          color="grey"
                        />
                      </Touchable>
                    </Box>
                  );
                })
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
                      paddingLeft: selectMultipleItems ? 50 : 15,
                      paddingY: 15,
                      width: '100%',
                      backgroundColor: 'transparent',
                      borderBottomWidth: 2,
                      borderColor: '#DDD',
                      borderStyle: 'solid',
                    })}
                  />

                  { allowMultipleSelection && selectMultipleItems ? (
                    <Touchable
                      withFeedback
                      onPress={() => {
                        selectMultipleItems( this.state.preSelected );
                        clearSelection();
                      }}
                    >
                      <Box
                        height="100%"
                        alignItems="center"
                        padding={10}
                        borderBottomWidth={2}
                        borderColor="#DDD"
                        borderStyle="solid"
                        backgroundColor="#DDD"
                      >
                        <Icon
                          name="done"
                          color="black"
                          size="md"
                        />
                      </Box>
                    </Touchable>
                  ) : null}

                  { inputValue ? (
                    <Box
                      position="absolute"
                      height="100%"
                      alignItems="center"
                      right={selectMultipleItems ? 50 : 10}
                      zIndex={5}
                    >
                      { inputValue ? (
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
                      ) : null }
                    </Box>
                  ) : null}
                </Box>

                {(
                  isArray( items ) ||
                  inputValue.length > 0
                ) ? (
                    items
                    .concat( allowNewTags ? [inputValue] : [] )
                    .filter( this.handleFilter( inputValue ))
                    .map(( item, index ) => {
                      const itemString = isObject( item ) ? item[itemStringKey] : item;
                      const itemId = isObject( item ) ? item[itemValueKey] : item;
                      const isSelected = allowMultipleSelection
                        ? (
                          this.state.preSelected &&
                          this.state.preSelected.filter(
                            i => i[itemValueKey] === itemId
                          ).length > 0
                        )
                        : selectedItems && selectedItems.includes( itemString );

                      return (
                        <Touchable
                          key={itemId}
                          {...getItemProps({
                            item,
                            withFeedback: true,
                            onPress: () => {
                              if ( allowMultipleSelection ) {
                                this.addItemToPreSelection({
                                  [itemStringKey]: itemString,
                                  [itemValueKey]: itemId,
                                });
                              }
                              else {
                                selectItem({
                                  [itemStringKey]: itemString,
                                  [itemValueKey]: itemId,
                                }, );
                                clearSelection();
                              }
                            },
                          })}
                        >
                          {
                            renderSuggestion
                              ? (
                                <LayoutConsumer>
                                  {layout => {
                                    const context = {
                                      item: {
                                        ...item,
                                        selected: isSelected,
                                      },
                                      layout,
                                    };

                                    return (
                                      <Recursive
                                        {...renderSuggestion}
                                        context={context}
                                      />
                                    );
                                  }}
                                </LayoutConsumer>
                              )
                              : (
                                <Box
                                  padding={15}
                                  borderBottomWidth={1}
                                  borderColor="#DDD"
                                  borderStyle="solid"
                                  alignItems="center"
                                >
                                  <Text
                                    color={highlightedIndex === index ? 'black' : 'gray'}
                                    fontWeight={isSelected ? 'bold' : 'normal'}
                                  >
                                    {itemString}
                                  </Text>
                                </Box>
                              )
                            }
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
                          : 'Please type...'
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
