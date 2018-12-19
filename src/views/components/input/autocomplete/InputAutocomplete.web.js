import React, { Component } from 'react';
import { func, string, number, oneOfType, array, bool } from 'prop-types';
import Downshift from 'downshift';
import { Text, Box, Input, Touchable } from '../../index';
import { isString } from '../../../../utils';

class InputAutocomplete extends Component {
  static defaultProps = {
    inputType: 'text',
    itemStringKey: 'name',
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
    onChangeValue: func,
    onBlur: func,
    onType: func,
    testID: string,
  }

  state = {
    filterValue: '',
  };

  componentDidUpdate( prevProps ) {
    if (
      this.state.filterValue === '' &&
      isString( this.props.value ) &&
      this.props.value !== prevProps.value
    ) {
      this.setFilterValue( this.props.value );
    }
  }

  setFilterValue = ( value ) => {
    this.setState({ filterValue: value });
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

  handleChange = item => {
    this.setState({
      filterValue: item.description,
    });
    if ( this.props.onChange )
      this.props.onChange( item );

    // if ( this.props.onChangeValue )
    //   this.props.onChangeValue( item );
  }

  handleType = ( item ) => {
    this.setState({
      filterValue: item,
    });
    if ( this.props.onType )
      this.props.onType( item );
  }

  render() {
    const {
      inputType,
      items,
      itemStringKey,
      borderBetweenItems,
      onBlur,
      value, // eslint-disable-line no-unused-vars
      testID,
      ...restProps
    } = this.props;

    // console.log( 'autocompprops', this.props && this.props.value );

    return (
      <Downshift
        defaultInputValue={(
          this.props.value ||
          this.props.defaultValue
        )}
        itemToString={item => (
          item == null ? ''
          : typeof item === 'string' ? item
          : item[itemStringKey]
        )}
        onChange={this.handleChange}
      >
        {({
          getRootProps,
          getItemProps,
          getInputProps,
          isOpen,
          selectedItem,
          inputValue,
          highlightedIndex,
          selectItem,
        }) => {
          // console.log( inputValue, this.state.filterValue );

          return (
            <Box
              {...getRootProps( undefined, { suppressRefError: true })}
              position="relative"
              testID={`input-autocomplete ${testID}`}
            >
              <Input
                {...getInputProps( restProps )}
                type={inputType}
                clearButtonMode="while-editing"
                onChangeValue={this.handleType}
                onBlur={onBlur}
                width="100%"
                testID={`${testID}`}
                value={this.state.filterValue}
              />

              {isOpen && (
                <Box
                  paddingY={5}
                  flexDirection="column"
                  position="absolute"
                  top="100%"
                  left={0}
                  width="100%"
                  backgroundColor="white"
                  borderRightWidth={2}
                  borderBottomWidth={2}
                  borderLeftWidth={2}
                  borderColor="#DDD"
                  borderStyle="solid"
                  zIndex={5}
                >
                  {(
                    items &&
                    items instanceof Array &&
                    items
                      .filter( this.handleFilter( inputValue ))
                      .length > 0
                  ) ? (
                      items
                        .filter( this.handleFilter( inputValue ))
                        .map(( item, index ) => {
                          const idom = typeof item === 'string'
                            ? item
                            : item[itemStringKey];

                          return (
                            <Touchable
                              {...getItemProps({ item: idom })}
                              key={idom}
                              onPress={() => selectItem( item )}
                              withFeedback
                              width="100%"
                              testID={`input-autocomplete-item ${testID}`}
                            >
                              <Box
                                {...( highlightedIndex === index ) && {
                                  backgroundColor: 'yellow',
                                }}
                                paddingX={15}
                                paddingY={10}
                                width="100%"
                                {...(
                                  borderBetweenItems &&
                                  index > 0
                                ) && {
                                  borderTopWidth: 1,
                                  borderColor: '#DDD',
                                  borderStyle: 'solid',
                                }}
                              >
                                <Text
                                  {...( selectedItem === idom ) && {
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {idom}
                                </Text>
                              </Box>
                            </Touchable>
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
                </Box>
              )}
            </Box>
          );
        }}
      </Downshift>
    );
  }
}

export default InputAutocomplete;
