import React, { Component, isValidElement } from 'react';
import { string, func, array, object } from 'prop-types';
import { isString, isArray, isObject } from '../../../../utils';
import { Box, MultiDownshift, Input, Text, Touchable, Icon, Recursive } from '../../index';

class InputTag extends Component {
  static defaultProps = {
    placeholder: 'Add a tag...',
    items: [],
    itemStringKey: 'label',
    itemValueKey: 'value',
    itemIdKey: 'id',
  }

  static propTypes = {
    onChangeValue: func,
    items: array,
    placeholder: string,
    itemStringKey: string,
    itemValueKey: string,
    itemIdKey: string,
    renderTag: object,
    context: object,
  }

  handleChange = selectedItems => {
    if ( this.props.onChangeValue )
      this.props.onChangeValue( selectedItems );
  }

  handleFilter = ( inputValue, selectedItems ) => dropdownItem => {
    const { itemStringKey } = this.props;
    const itemString = isObject( dropdownItem ) ? dropdownItem[itemStringKey] : dropdownItem;

    if ( selectedItems.includes( itemString ))
      return false;

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

  render() {
    const { items, itemIdKey, itemStringKey, renderTag, ...restProps } = this.props;

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
              zIndex={5}
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
                    ...restProps,
                    type: 'text',
                    width: '100%',
                    ref: input => this.input = input,
                    onChangeValue: onInputValueChange,
                    value: inputValue,
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
                  {(
                    isArray( items ) ||
                    inputValue.length > 0
                  ) ? (
                      items
                      .filter( this.handleFilter( inputValue, selectedItems ))
                      .concat( [inputValue] )
                      .map(( item, index ) => {
                        const itemString = isObject( item ) ? item[itemStringKey] : item;
                        const itemId = isObject( item ) ? item[itemIdKey] : item;

                        return (
                          <Touchable
                            key={itemId}
                            {...getItemProps({
                              item,
                              withFeedback: true,
                              onPress: () => {
                                selectItem( itemString );
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
                              width="100%"
                            >
                              <Text
                                color={highlightedIndex === index ? 'black' : 'gray'}
                                fontWeight={selectedItems.includes( itemString ) ? 'bold' : 'normal'}
                              >
                                {itemString}
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
                selectedItems.map( item => {
                  if ( renderTag ) {
                    const context = {
                      ...this.props.context,
                      name: item,
                      onRemove: () => removeItem( item ),
                    };

                    return isValidElement( renderTag ) ? renderTag
                      : isArray( renderTag )
                        ? renderTag.map(( child, i ) => (
                          isValidElement( child )
                            ? child
                            : (
                              <Recursive
                                key={i} // eslint-disable-line
                                {...child}
                                context={context}
                              />
                            )))
                        : (
                          <Recursive
                            {...renderTag}
                            context={context}
                          />
                        );
                  }

                  return (
                    <Box
                      key={item}
                      backgroundColor="#CCC"
                      alignItems="center"
                      marginRight={10}
                      marginBottom={10}
                      borderRadius={20}
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
                  );
                })
              )}
            </Box>
          </Box>
        )}
      </MultiDownshift>
    );
  }
}

export default InputTag;
