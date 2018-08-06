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
      nextProps.onChangeValue( nextProps.value );

      return { selected: nextProps.value };
    }

    if (
      nextProps.value == null &&
      ( nextState.selected === null ||
        nextState.selected === undefined ) &&
      nextProps.items != null
    ) {
      const item = nextProps.items && nextProps.items[0];

      if ( item && item.value ) {
        nextProps.onChangeValue( item.value );

        return { selected: item.value };
      }
    }

    return null;
  }

  state = {
    selected: this.props.value,
  }

  handlePress = value => () => {
    this.setState( state => {
      if ( state.selected === value ) {
        return;
      }

      return { 
        selected: value,
      };
    }, () => {
      if ( this.props.onChangeValue ) {
        this.props.onChangeValue( this.state.selected );
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
