import React, { Component } from 'react';
import { string, func, array, bool, object } from 'prop-types';
import { isString, isArray, isObject } from '../../../../utils';
import { Box, MultiDownshift, Text } from '../../index';
import InputTagBody from './tag-body';
import InputTagInputField from './tag-input-field';
import InputTagItem from './tag-item';
import InputTagSuggestion from './tag-suggestion';
import InputTagSuggestionContainer from './tag-suggestion-container';

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

  shouldComponentUpdate( nextProps ) {
    if ( nextProps.items !== this.props.items )
      return true;

    return false;
  }

  itemToString = ( item ) => {
    return isObject( item ) ? item[this.props.itemStringKey] : item;
  }

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

  addItemToPreSelection = ( item, callback ) => {
    const { itemValueKey } = this.props;

    this.setState(
      ({ preSelected }) => ({
        preSelected: preSelected.filter( i => i[itemValueKey] === item[itemValueKey] ).length > 0
          ? preSelected.filter( i => i[itemValueKey] !== item[itemValueKey] )
          : [...preSelected, item],
      }), () => {
        if ( callback ) callback( this.state.preSelected );
      });
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
       // STATE HOLDER
      <MultiDownshift
        allowMultipleSelection
        onChange={this.handleChange}
        itemToString={this.itemToString}
        selectedItems={isArray( value )
          ? value.map( i => isObject( i )
            ? items.filter( x => x[itemValueKey] === i ).length > 0
              ? items.filter( x => x[itemValueKey] === i )[0]
              : i
            : { [itemStringKey]: i, [itemValueKey]: i })
          : null
        }
        addItemFunction={(( selectedItems, newItem ) => {
          return selectedItems.filter( i => (
            newItem != null &&
            i[itemValueKey] === newItem[itemValueKey] )).length === 0
            ? [...selectedItems, newItem]
            : selectedItems;
        })}
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
          handleToggleMenu,
          selectItem,
          onInputValueChange,
          clearSelection,
          selectMultipleItems,
        }) => (
          // WRAPPER
          <InputTagBody
            bodyProps={{
              ...getRootProps( undefined, { suppressRefError: true }),
              flexDirection: 'column',
            }}
            isOpen={isOpen}
            handleToggleMenu={handleToggleMenu}
          >
            {/* INPUT */ }
            <InputTagInputField
              inputProps={restProps}
              getInputProps={getInputProps}
              onPress={handleToggleMenu}
              shouldFocus={!isOpen}
              inputValue={inputValue}
              onChangeValue={onInputValueChange}
            />

            {/* SELECTED TAGS CONTAINER */ }
            <Box
              flexWrap="wrap"
              marginTop={10}
              {...tagsWrapperProps}
            >
              {selectedItems.length > 0 && (
                selectedItems.map( item => {
                  const itemString = isObject( item ) ? item[itemStringKey] : item;

                  const itemId = isObject( item ) ? item[itemValueKey] : item;
                  const itemObject = isObject( item )
                    ? item
                    : {
                      [itemStringKey]: itemString,
                      [itemValueKey]: itemId,
                    };
                  const onPress = () => {
                    removeItem( itemObject,  );
                    this.removeItemToPreSelection( itemObject );
                  };

                  return (
                    <InputTagItem
                      key={itemId}
                      renderProp={renderTag}
                      item={itemObject}
                      itemString={itemString}
                      touchableProps={getRemoveButtonProps({
                        withFeedback: true,
                        onPress: onPress,
                        style: {
                          padding: 10,
                        },
                      })}
                      onPress={onPress}
                    />
                  );
                })
              )}
            </Box>
            {/* SUGGESTIONS CONTAINER */ }
            <InputTagSuggestionContainer
              isOpen={isOpen}
              onPressClose={handleToggleMenu}
              onPressClear={clearSelection}
              onPressItem={() => {
                selectMultipleItems( this.state.preSelected );
                handleToggleMenu();
                clearSelection();
              }}
              inputValue={inputValue}
              allowMultipleSelection={allowMultipleSelection}
              inputProps={getInputProps({
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
            >
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
                    const itemObject = isObject( item )
                      ? item
                      : {
                        [itemStringKey]: itemString,
                        [itemValueKey]: itemId,
                      };
                    const isSelected = allowMultipleSelection
                      ? (
                        this.state.preSelected &&
                        this.state.preSelected.filter(
                          i => i[itemValueKey] === itemId
                        ).length > 0
                      )
                      : selectedItems && selectedItems.includes( itemString );

                    return (
                      // RENDER SUGGESTION
                      <InputTagSuggestion
                        key={itemId}
                        renderProp={renderSuggestion}
                        item={itemObject}
                        itemString={itemString}
                        isSelected={isSelected}
                        isHighlighted={highlightedIndex === index}
                        getItemProps={getItemProps}
                        allowMultipleSelection={allowMultipleSelection}
                        functions={{
                          selectMultipleItems: selectMultipleItems,
                          addItemToPreSelection: this.addItemToPreSelection,
                          selectItem: selectItem,
                          clearSelection: clearSelection,
                          handleToggleMenu: handleToggleMenu,
                        }}
                      />
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
            </InputTagSuggestionContainer>
          </InputTagBody>
        )}
      </MultiDownshift>
    );
  }
}

export default InputTag;
