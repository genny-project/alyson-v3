import React, { Component } from 'react';
import { array, func, string, object, number, oneOf } from 'prop-types';
import { isArray, objectClean } from '../../../../utils';
import { Box, Text, Touchable } from '../../index';

const textSizes = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
};

class Checkbox extends Component {
  static defaultProps = {
    color: 'grey',
    textSize: 'xs',
  }

  static propTypes = {
    items: array,
    value: array,
    onChangeValue: func,
    color: string,
    textSize: oneOf(
      ['xs','sm','md','lg','xl']
    ),
    borderRadius: number,
    wrapperProps: object,
    activeStyling: object,
    inputWrapperProps: object,
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
    // timer: null,
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
        // clearTimeout( this.state.timer );

        // this.state.timer = setTimeout(
        //   () => {
        //     onChangeValue( this.state.selected );
        //   },
        //   1000
        // );
        onChangeValue( this.state.selected );
      }
    });
  }

  render() {
    const {
      items,
      color,
      borderRadius,
      textSize,
      activeStyling,
      wrapperProps,
      ...restProps
    } = this.props;
    const { selected } = this.state;

    return (
      <Box
        {...wrapperProps}
        flexDirection="row"
        width="100%"
      >
        {
          selected &&
            isArray( items, { ofMinLength: 1 }) ? (
              items.map(( item, index ) => {
                const isSelected = selected === item.value;

                const inputStyle = objectClean({
                  ...borderRadius
                    ? {
                      borderRadius,
                    }
                    : {
                      borderTopLeftRadius: index === 0 ? 10 : 0,
                      borderTopRightRadius: index === items.length - 1 ? 10 : 0,
                      borderBottomRightRadius: index === items.length - 1 ? 10 : 0,
                      borderBottomLeftRadius: index === 0 ? 10 : 0,
                    },
                  color,
                  backgroundColor: 'white',
                  padding: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  ...restProps,
                  ...isSelected ? activeStyling : {},
                });

                const textStyle = objectClean({
                  color: isSelected && activeStyling.color || color,
                  size: textSizes[isSelected && activeStyling.textSize || textSize],
                });

                return (
                  <Touchable
                    key={item.value}
                    onPress={!isSelected ? this.handlePress( item.value ) : null}
                  >
                    <Box
                      {...inputStyle}
                    >
                      <Text
                        {...textStyle}
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
