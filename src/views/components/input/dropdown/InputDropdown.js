import React, { Component, Fragment } from 'react';
import { Picker } from 'react-native';
import { oneOfType, arrayOf, string, any, shape, number, func, bool, oneOf } from 'prop-types';
// import memoize from 'memoize-one';
import { isArray, isObject } from '../../../../utils';

/** Ensure the props we're going to use were indeed passed through. */
const filterOutUnspecifiedProps = props => {
  const keys = Object.keys( props );

  return keys.reduce(( filteredProps, prop ) => {
    if ( props[prop] != null )
      filteredProps[prop] = props[prop];

    return filteredProps;
  }, {});
};

const textSizes = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
};

class InputDropdown extends Component {
  static defaultProps = {
    itemStringKey: 'label',
    itemValueKey: 'value',
    itemIdKey: 'id',
    placeholder: 'Please select...',
  }

  static propTypes = {
    value: any,
    onChangeValue: func,
    itemStringKey: string,
    itemValueKey: string,
    itemIdKey: string,
    placeholder: string,
    disabled: bool,
    items: oneOfType(
      [
        arrayOf( string ),
        arrayOf(
          shape({
            label: string.isRequired,
            value: oneOfType(
              [number, string]
            ).isRequired,
            color: string,
            testID: string,
          })
        ),
      ]
    ).isRequired,
    margin: number,
    marginX: number,
    marginY: number,
    marginTop: number,
    marginRight: number,
    marginBottom: number,
    marginLeft: number,
    error: bool,
    success: bool,
    warning: bool,
    icon: string,
    padding: number,
    paddingX: number,
    paddingY: number,
    paddingTop: number,
    paddingRight: number,
    paddingBottom: number,
    paddingLeft: number,
    textSize: oneOf(
      ['xs','sm','md','lg','xl']
    ),
    textAlign: oneOf(
      ['left', 'center','right']
    ),
    height: oneOfType(
      [string, number]
    ),
    width: oneOfType(
      [string, number]
    ),
    backgroundColor: string,
    borderWidth: number,
    borderTopWidth: number,
    borderRightWidth: number,
    borderBottomWidth: number,
    borderLeftWidth: number,
    borderColor: string,
    borderRadius: number,
    borderBottomLeftRadius: number,
    borderBottomRightRadius: number,
    borderTopLeftRadius: number,
    borderTopRightRadius: number,
    returnKeyLabel: string,
    prefixIconType: string,
    iconType: string,
    placeholderColor: string,
    color: string,
    appearance: string,
  }

  componentDidMount() {
    if ( this.props.appearance === 'none' ) {
      this.injectNativeProps({
        'data-appearance-none': true,
      });
    }
  }

  shouldComponentUpdate( nextProps ) {
    if ( nextProps.value !== this.props.value )
      return true;

    if ( nextProps.items !== this.props.items )
      return true;

    return false;
  }

  handleChange = value => {
    const { placeholder } = this.props;

    if ( value === placeholder )
      return;

    if ( this.props.onChangeValue )
      this.props.onChangeValue( value );
  }

  handleSort = ( a, b ) => {
    var nameA = a.name.toLowerCase(); // ignore upper and lowercase
    var nameB = b.name.toLowerCase(); // ignore upper and lowercase

    if ( nameA < nameB ) {
      return -1;
    }
    if ( nameA > nameB ) {
      return 1;
    }

    // names must be equal
    return 0;
  }

  injectNativeProps( nativeProps ) {
    if ( !this.picker ) return;
    if ( !this.picker.setNativeProps ) return;

    this.picker.setNativeProps( nativeProps );
  }

  render() {
    const {
      items,
      itemStringKey,
      itemValueKey,
      itemIdKey,
      disabled,
      placeholder,
      margin,
      marginX,
      marginY,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      padding,
      paddingX,
      paddingY,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      textSize,
      textAlign,
      height,
      backgroundColor,
      borderWidth,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
      borderColor,
      borderRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      color,
      ...restProps
    } = this.props;

    const { value } = this.props;

    const inputStyle = filterOutUnspecifiedProps({
      margin,
      marginHorizontal: marginX,
      marginVertical: marginY,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      padding,
      paddingHorizontal: paddingX,
      paddingVertical: paddingY,
      paddingTop: paddingTop,
      paddingRight: paddingRight,
      paddingBottom,
      paddingLeft,
      fontSize: textSizes[textSize],
      textAlign: textAlign,
      height,
      width: '100%', // Always be 100% of the parent width
      backgroundColor,
      borderWidth,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
      borderColor,
      borderRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      color,
    });

    const validItems = isArray( items, { ofMinLength: 1 });

    return (
      <Picker
        {...restProps}
        enabled={!disabled && validItems}
        onValueChange={this.handleChange}
        selectedValue={value || placeholder}
        style={inputStyle}
        ref={picker => this.picker = picker}
      >
        {validItems ? (
          <Fragment>
            {placeholder ? (
              <Picker.Item
                label={placeholder}
                disabled
                hidden
              />
            ) : null}

            {items
              .sort( this.handleSort )
              .map( item => {
                const isItemObject = isObject( item );

                return (
                  <Picker.Item
                    key={(
                      isItemObject
                        ? ( item[itemIdKey] || item[itemStringKey] )
                        : item
                    )}
                    label={isItemObject ? item[itemStringKey] : item}
                    value={isItemObject ? item[itemValueKey] : item}
                  />
                );
              })
            }
          </Fragment>
        ) : (
          <Picker.Item
            label="No items to show"
            hidden
          />
        )}
      </Picker>
    );
  }
}

export default InputDropdown;
