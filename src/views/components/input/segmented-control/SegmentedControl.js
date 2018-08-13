import React, { Component } from 'react';
import { array, func, string } from 'prop-types';
import { isArray } from '../../../../utils';
import { Box, Text, Touchable } from '../../index';

class Checkbox extends Component {
  static defaultProps = {
    backgroundColor: 'white',
    textColor: '#202532',
    selectedBackgroundColor: '#202532',
    selectedTextColor: 'white',
  }

  static propTypes = {
    items: array,
    value: array,
    onChangeValue: func,
    backgroundColor: string,
    textColor: string,
    selectedBackgroundColor: string,
    selectedTextColor: string,
  }

  static getDerivedStateFromProps( nextProps, nextState ) {
    if (
      nextProps.value != null &&
      nextProps.value !== nextState.selected
    ) {
      return {
        selected: nextProps.value,
      };
    }

    if (
      nextProps.value == null &&
      ( nextState.selected === null ||
        nextState.selected === undefined ) &&
        Array.isArray( nextProps.items ) &&
        nextProps.items.length > 0 &&
        nextProps.items[0].value !== null
    ) {
      return { 
        selected: nextProps.items[0].value,
      };
    }

    return null;
  }

  state = {
    selected: this.props.value,
  }

  componentDidMount() {
    const { value, items, onChangeValue } = this.props;

    if (
      value != null
    ) {
      this.setState({
        selected: value,
      }, () => {
        if ( onChangeValue ) {
          onChangeValue( value );
        }
      });
    }
    else if (
      value == null &&
      items !== null &&
      Array.isArray( items ) &&
      items.length > 0 &&
      items[0].value !== null
    ) {
      this.setState({
        selected: items[0].value,
      }, () => {
        if ( onChangeValue ) {
          onChangeValue( items[0].value );
        }
      });
    }
  }

  handlePress = value => () => {
    const { onChangeValue } = this.props;

    this.setState( state => {
      if ( state.selected === value ) {
        return;
      }

      return { 
        selected: value,
      };
    }, () => {
      if ( onChangeValue ) {
        onChangeValue( this.state.selected );
      }
    });
  }

  render() {
    const {
      items,
      backgroundColor,
      textColor,
      selectedBackgroundColor,
      selectedTextColor,
    } = this.props;
    const { selected } = this.state;
    
    return (
      <Box
        flexDirection="row"
        width="100%"
      >
        {
          selected &&
            isArray( items, { ofMinLength: 1 }) ? (
              items.map(( item, index ) => {
                const borderCorners = {
                  borderTopLeftRadius: index === 0 ? 10 : 0,
                  borderTopRightRadius: index === items.length - 1 ? 10 : 0,
                  borderBottomRightRadius: index === items.length - 1 ? 10 : 0,
                  borderBottomLeftRadius: index === 0 ? 10 : 0,
                };

                return (
                  <Touchable
                    key={item.value}
                    onPress={selected !== item.value ? this.handlePress( item.value ) : null}
                  >
                    <Box
                      alignItems="center"
                      justifyContent="center"
                      flex={1}
                      padding={15}
                      backgroundColor={selected === item.value
                        ? selectedBackgroundColor
                        : backgroundColor
                      }
                      {...borderCorners}
                    >
                      <Text
                        size="xs"
                        color={selected === item.value
                          ? selectedTextColor
                          : textColor
                        }
                      >
                        {item.label}
                      </Text>
                    </Box>
                  </Touchable>
                );
              })
            ) : (
              <Text>
                No items to show
              </Text>
            )}
      </Box>
    );
  }
}

export default Checkbox;
