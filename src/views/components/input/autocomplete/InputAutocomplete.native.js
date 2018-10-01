import React, { Component } from 'react';
import { SafeAreaView, ActivityIndicator } from 'react-native';
import { func, string, number, oneOfType, array, bool, object } from 'prop-types';
import Downshift from 'downshift';
import { Text, Box, Input, Icon, Touchable, Modal } from '../../index';
import { Bridge } from '../../../../utils';
import { store } from '../../../../redux';

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

  state = {
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

  handleDismiss = ( selectedItem ) => {
    const { data } = store.getState().vertx.baseEntities;

    if ( selectedItem && data && this.props.defaultValue !== selectedItem ) {
      console.log( data );
      Object.keys( data ).forEach( be => {
        if ( data[be].name === selectedItem ) {
          console.log( 'sending' );
          Bridge.sendEvent({
            event: 'BTN',
            eventType: 'BTN_CLICK',
            sendWithToken: true,
            data: {
              code: 'SEE_PROFILE',
              value: JSON.stringify({
                userCode: be,
              }),
            },
          });

          return;
        }
      });
    }
    if ( this.props.onBlur )
      this.props.onBlur();
  }

  handleChange = item => {
    if ( this.props.onChange )
      this.props.onChange( item );

    if ( this.state.timer ) {
      clearTimeout( this.state.timer );
    }

    this.setState({
      timer: setTimeout(() => {
        Bridge.sendEvent({
          event: 'BTN',
          eventType: 'BTN_CLICK',
          sendWithToken: true,
          data: {
            code: 'SEARCH_KEYWORD',
            value: JSON.stringify({
              itemCode: item,
            }),
          },
        });
      }, 1000 ),
    });
  }

  handleClearInputValue = setState => () => {
    setState({ inputValue: '' });
  }

  render() {
    const {
      inputType,
      itemStringKey,
      inputProps,
      onType,
      width,
      defaultValue,
      value,
    } = this.props;

    const ites = [];
    const { data } = store.getState().vertx.baseEntities;

    if ( data && Object.keys( data ).length > 0 && data['GRP_KEYWORD_SEARCH'] && data['GRP_KEYWORD_SEARCH'].links ) {
      data['GRP_KEYWORD_SEARCH'].links.forEach( link => {
        if (
          link &&
            link.link &&
            link.link.targetCode
        ) {
          if ( data[link.link.targetCode] ) {
            ites.push( data[link.link.targetCode].name );
          }
        }
      });
    }

    return (
      <Downshift
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
          const finalItems = ites.filter( this.handleFilter( inputValue ));

          return (
            <Box
              {...getRootProps( undefined, { suppressRefError: true })}
              width={width}
            >
              <Touchable
                withFeedback
                onPress={openMenu}
                style={{
                  width: '100%',
                  position: 'relative',
                }}
              >
                <Input
                  {...inputProps}
                  type={inputType}
                  value={inputValue}
                  editable={false}
                  width="100%"
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
                style={{
                  backgroundColor: 'white',
                }}
                onDismiss={() => this.handleDismiss( selectedItem )}
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
                        onPress={closeMenu}
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
                      type={inputType}
                      clearButtonMode="while-editing"
                      onChangeValue={onType || this.handleChange}
                      autoFocus
                      paddingLeft={50}
                      paddingY={15}
                      width="100%"
                      placeholder={inputProps.placeholder}
                      backgroundColor="transparent"
                      borderRadius={0}
                      borderLeftWidth={0}
                      borderRightWidth={0}
                      borderTopWidth={0}
                    />

                    {
                      inputValue ? (
                        <Box
                          position="absolute"
                          height="100%"
                          alignItems="center"
                          right={10}
                          zIndex={5}
                        >
                          <Touchable
                            withFeedback
                            onPress={this.handleClearInputValue( setState )}
                          >
                            <Icon
                              name="close"
                              color="black"
                              size="md"
                            />
                          </Touchable>
                        </Box>
                      ) : null
                    }
                  </Box>

                  {(
                    ites &&
                    ites instanceof Array &&
                    finalItems.length > 0
                  ) ? (
                      ites.map( item => {
                        const idom = typeof item === 'string'
                          ? item
                          : item[itemStringKey];

                        return (
                          <Touchable
                            {...getItemProps({ item: idom })}
                            key={idom}
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
                                fontWeight={selectedItem === idom ? 'bold' : 'normal'}
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
                        width="100%"
                        justifyContent="center"
                      >
                        {inputValue.length > 0
                          ? <ActivityIndicator />
                          : (
                            <Text
                              align="center"
                              color="grey"
                              size="xs"
                            >
                             'Please enter an address above'
                            </Text>
                          )
                          }
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
