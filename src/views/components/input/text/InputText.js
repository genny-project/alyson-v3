import React, { Component } from 'react';
import { TextInput, Platform } from 'react-native';
import { string, oneOf, number, shape, bool, func, any, oneOfType, node } from 'prop-types';
import { objectClean } from '../../../../utils';
import { Box, Icon, Text } from '../../../components';
import styles from './InputText.style';

class Input extends Component {
  static defaultProps = {
    autoCapitalize: 'sentences',
    autoComplete: 'no',
    autoCorrect: true,
    autoFocus: false,
    blurOnSubmit: true,
    clearTextOnFocus: false,
    disabled: false,
    keyboardType: 'default',
    multiline: false,
    placeholder: 'Type here...',
    secureTextEntry: false,
    selectTextOnFocus: false,
    spellCheck: true,
    padding: 10,
    error: false,
    success: false,
    warning: false,
    textSize: 'xs',
    textAlign: 'left',
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
    forwardedRef: any,
    width: oneOfType(
      [number, string]
    ),
    prefix: oneOfType(
      [string, node]
    ),
    suffix: oneOfType(
      [string, node]
    ),
    prefixIcon: string,
    suffixIcon: string,
    prefixColor: string,
    suffixColor: string,
    prefixBackground: string,
    suffixBackground: string,
    textSize: oneOf(
      ['xs','sm','md','lg','xl']
    ),
    textAlign: oneOf(
      ['left', 'center','right']
    ),
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
      onBlur,
      onChange,
      onChangeValue,
      onFocus,
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
      forwardedRef,
      width,
      prefix,
      suffix,
      prefixIcon,
      suffixIcon,
      prefixColor,
      suffixColor,
      prefixBackground,
      suffixBackground,
      textSize,
      textAlign,
    } = this.props;

    const textSizes = {
      xs: 14,
      sm: 16,
      md: 18,
      lg: 20,
      xl: 24,
    };

    const status =
      error ? styles.error
        : success ? styles.success
          : warning ? styles.warning
            : styles.default;

    const hasIconStyle = icon
      ? styles.inputWithIcon
      : null;

    const inputStyle = objectClean({
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
      paddingTop,
      paddingRight: (
        paddingRight ||
        ( hasIconStyle && 40 ) ||
        null
      ),
      paddingBottom,
      paddingLeft,
      fontSize: textSizes[textSize],
      textAlign: textAlign,
    });

    const statusColor =
      disabled ? 'lightGrey'
        : success ? 'green'
          : error ? 'red'
            : warning ? 'yellow'
              : 'grey';

    const nativeProps = {
      onLayout,
    };

    const webProps = {

    };

    const childPrefix = ( prefixIcon != null ) ? (
      <Icon
        color={prefixColor || 'darkGrey'}
        name={prefixIcon}
      />
    ) : ( typeof prefix === 'string' ) ? (
      <Text
        color={prefixColor || 'darkGrey'}
        decoration="none"
        align="center"
        width="100%"
      >
        {prefix}
      </Text>
    ) : (
      prefix || null
    );

    const childSuffix = ( suffixIcon != null ) ? (
      <Icon
        color={suffixColor || 'darkGrey'}
        name={suffixIcon}
      />
    ) : ( typeof suffix === 'string' ) ? (
      <Text
        color={suffixColor || 'darkGrey'}
        decoration="none"
        align="center"
        width="100%"
      >
        {suffix}
      </Text>
    ) : (
      suffix || null
    );

    return (
      <Box
        display="flex"
        width={width}
      >
        {
          childPrefix &&
          (
            <Box
              backgroundColor={prefixBackground || 'lightGrey'}
              alignItems="center"
              flexGrow={0}
              paddingX={10}
            >
              {childPrefix}
            </Box>
          )
        }
        <Box
          position="relative"
          flex={1}
        >
          <TextInput
            autoCapitalize={autoCapitalize}
            autoComplete={autoComplete}
            autoCorrect={autoCorrect}
            autoFocus={autoFocus}
            blurOnSubmit={blurOnSubmit}
            clearTextOnFocus={clearTextOnFocus}
            defaultValue={defaultValue}
            editable={!disabled}
            keyboardType={keyboardType}
            maxLength={maxLength}
            multiline={multiline}
            onBlur={onBlur}
            onChange={onChange}
            onChangeText={onChangeValue}
            onFocus={onFocus}
            onKeyPress={onKeyPress}
            onSelectionChange={onSelectionChange}
            onSubmitEditing={onSubmitEditing}
            placeholder={placeholder}
            placeholderTextColor={statusColor}
            secureTextEntry={secureTextEntry}
            selection={selection}
            selectTextOnFocus={selectTextOnFocus}
            spellCheck={spellCheck}
            style={[
              styles.input,
              inputStyle,
              status,
              hasIconStyle,
            ]}
            value={value}
            underlineColorAndroid="transparent"
            {...Platform.select({
              ios: nativeProps,
              android: nativeProps,
              web: webProps,
            })}
            ref={forwardedRef}
          />
          {icon && (
            <Box
              position="absolute"
              right={10}
              height="100%"
              alignItems="center"
            >
              <Icon
                name={icon}
                color={statusColor}
                size="md"
              />
            </Box>
          )}
        </Box>
        {
          childSuffix &&
          (
            <Box
              backgroundColor={suffixBackground || 'lightGrey'}
              alignItems="center"
              flexGrow={0}
              paddingX={10}
            >
              {childSuffix}
            </Box>
          )
        }
      </Box>
    );
  }
}

export default Input;
