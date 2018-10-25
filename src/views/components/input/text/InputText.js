import React, { Component } from 'react';
import { TextInput, Platform } from 'react-native';
import { string, oneOf, number, shape, bool, func, oneOfType, node, object } from 'prop-types';
import { Box, Icon, Text } from '../../../components';

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

const InputPrefixWrapper = ({ children }) => (
  <Box
    position="absolute"
    left={15}
    height="100%"
    alignItems="center"
  >
    {children}
  </Box>
);

const InputSuffixWrapper = ({ children }) => (
  <Box
    position="absolute"
    right={15}
    height="100%"
    alignItems="center"
  >
    {children}
  </Box>
);

const errorStyle = {

};

const warningStyle = {

};

const successStyle = {

};

class Input extends Component {
  static defaultProps = {
    autoCapitalize: 'sentences',
    autoComplete: 'no',
    autoCorrect: true,
    autoFocus: false,
    blurOnSubmit: true,
    clearTextOnFocus: false,
    keyboardType: 'default',
    multiline: false,
    placeholder: 'Type here...',
    secureTextEntry: false,
    selectTextOnFocus: false,
    spellCheck: true,
    error: false,
    success: false,
    warning: false,
    textSize: 'xs',
    textAlign: 'left',
    prefixColor: 'grey',
    editable: true,
  }

  static propTypes = {
    autoCapitalize: oneOf(
      ['characters', 'none', 'sentences', 'words']
    ),
    autoComplete: string,
    autoCorrect: bool,
    autoFocus: bool,
    blurOnSubmit: func,
    clearTextOnFocus: bool,
    defaultValue: string,
    disabled: bool,
    keyboardType: oneOf(
      ['default', 'email-address', 'numeric', 'phone-pad', 'search', 'url', 'web-search']
    ),
    maxLength: number,
    multiline: bool,
    onBlur: func,
    onChange: func,
    onChangeValue: func,
    onChangeText: func,
    onFocus: func,
    onKeyPress: func,
    onLayout: func,
    onSelectionChange: func,
    onSubmitEditing: func,
    placeholder: string,
    secureTextEntry: bool,
    selection: shape({
      start: number,
      end: number,
    }),
    selectTextOnFocus: bool,
    spellCheck: bool,
    value: string,
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
    prefix: oneOfType(
      [string, node]
    ),
    suffix: oneOfType(
      [string, node]
    ),
    prefixColor: string,
    suffixColor: string,
    iconColor: string,
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
    prefixIcon: string,
    editable: bool,
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
    borderSize: number,
    wrapperProps: object,
    returnKeyLabel: string,
    returnKeyType: oneOf(
      ['done', 'next', 'go', 'search', 'send', 'default']
    ),
    prefixIconType: string,
    iconType: string,
    activeStyling: object,
    placeholderColor: string,
    activeProps: string,
    color: string,
  }

  state = {
    isFocused: false,
    // isHovering: false,
  }

  getStatusColor() {
    const { disabled, success, error, warning } = this.props;

    return disabled ? 'lightGrey'
      : success ? 'green'
      : error ? 'red'
      : warning ? 'yellow'
      : 'grey';
  }

  handleRef = input => {
    this.input = input;
  }

  handleChangeText = event => {
    if ( this.props.onChangeText ) {
      this.props.onChangeText( event );
    }

    if ( this.props.onChangeValue ) {
      this.props.onChangeValue( event );
    }
  }

  handleFocus = event => {
    this.setState({
      isFocused: true,
    });

    if ( this.props.onFocus )
      this.props.onFocus( event );
  }

  handleBlur = event => {
    this.setState({
      isFocused: false,
    });

    if ( this.props.onBlur )
      this.props.onBlur( event );
  }

  focus() {
    if ( this.input )
      this.input.focus();
  }

  blur() {
    if ( this.input )
      this.input.blur();
  }

  renderPrefix() {
    const { prefix, prefixIcon, prefixColor, prefixIconType } = this.props;

    if ( prefixIcon ) {
      return (
        <InputPrefixWrapper>
          <Icon
            name={prefixIcon}
            color={prefixColor}
            type={prefixIconType}
          />
        </InputPrefixWrapper>
      );
    }

    if ( typeof prefix !== 'string' )
      return prefix;

    return (
      <InputPrefixWrapper>
        <Text
          color="black"
        >
          {prefix}
        </Text>
      </InputPrefixWrapper>
    );
  }

  renderSuffix() {
    const { suffix, icon, suffixColor, iconColor, iconType } = this.props;

    if ( icon ) {
      return (
        <InputSuffixWrapper>
          <Icon
            name={icon}
            color={iconColor || suffixColor || this.getStatusColor()}
            type={iconType}
          />
        </InputSuffixWrapper>
      );
    }

    if ( typeof suffix !== 'string' )
      return suffix;

    return (
      <InputSuffixWrapper>
        <Text
          color={suffixColor}
        >
          {suffix}
        </Text>
      </InputSuffixWrapper>
    );
  }

  render() {
    const {
      autoCapitalize,
      autoComplete,
      autoCorrect,
      autoFocus,
      blurOnSubmit,
      clearTextOnFocus,
      defaultValue,
      disabled,
      keyboardType,
      maxLength,
      multiline,
      onChange,
      onKeyPress,
      onLayout,
      onSelectionChange,
      onSubmitEditing,
      placeholder,
      secureTextEntry,
      selection,
      selectTextOnFocus,
      spellCheck,
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
      value,
      error,
      success,
      warning,
      icon,
      width,
      prefix,
      suffix,
      prefixIcon,
      textSize,
      textAlign,
      height,
      editable,
      backgroundColor,
      borderWidth,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
      borderColor,
      borderRadius,
      borderSize,
      wrapperProps,
      returnKeyLabel,
      returnKeyType,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      activeStyling,
      placeholderColor,
      activeProps,
      color,
    } = this.props;

    const { isFocused } = this.state;

    const statusStyle =
      error ? errorStyle
      : success ? successStyle
      : warning ? warningStyle
      : {};

    /* TODO: performance optimisation? */
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
      borderSize,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      color,
      ...isFocused ? activeStyling : {},
    });

    const nativeProps = {
      onLayout,
    };

    const webProps = {

    };

    return (
      <Box
        {...wrapperProps}
        position="relative"
        flex={1}
        width={width}
      >
        <TextInput
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={autoCorrect}
          autoFocus={autoFocus}
          blurOnSubmit={blurOnSubmit}
          clearTextOnFocus={clearTextOnFocus}
          defaultValue={defaultValue}
          editable={(
            editable == null ? disabled : editable
          )}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          onChange={onChange}
          onChangeText={this.handleChangeText}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onKeyPress={onKeyPress}
          onSelectionChange={onSelectionChange}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor || this.getStatusColor()}
          returnKeyLabel={!multiline ? returnKeyLabel : null}
          returnKeyType={!multiline ? returnKeyType : null}
          secureTextEntry={secureTextEntry}
          selection={selection}
          selectTextOnFocus={selectTextOnFocus}
          spellCheck={spellCheck}
          style={[
            inputStyle,
            statusStyle,
          ]}
          value={value}
          underlineColorAndroid="transparent"
          {...Platform.select({
            ios: nativeProps,
            android: nativeProps,
            web: webProps,
          })}
          ref={this.handleRef}
          {...isFocused ? activeProps : {}}
        />

        {(
          prefix ||
          prefixIcon
        )
          ? this.renderPrefix()
          : null}

        {(
          icon ||
          suffix
        )
          ? this.renderSuffix()
          : null}
      </Box>
    );
  }
}

InputPrefixWrapper.propTypes = {
  children: node,
};

InputSuffixWrapper.propTypes = {
  children: node,
};

export default Input;
