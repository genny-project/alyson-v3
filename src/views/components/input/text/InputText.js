import React from 'react';
import { TextInput, Platform } from 'react-native';
import { string, oneOf, number, shape, bool, func } from 'prop-types';
import { objectClean } from '../../../../utils';
import { Box, Icon } from '../../../components';
import styles from './InputText.style';

const InputText = ({
  autoCapitalize = 'sentences',
  autoComplete = 'no',
  autoCorrect = true,
  autoFocus = false,
  blurOnSubmit = true,
  clearTextOnFocus = false,
  defaultValue,
  disabled = false,
  keyboardType = 'default',
  maxLength,
  multiline = false,
  onBlur,
  onChange,
  onChangeText,
  onFocus,
  onKeyPress,
  onLayout,
  onSelectionChange,
  onSubmitEditing,
  placeholder = 'Type here...',
  secureTextEntry = false,
  selection,
  selectTextOnFocus = false,
  spellCheck = true,
  margin,
  marginX,
  marginY,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  padding = 10,
  paddingX,
  paddingY,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  value,
  error = false,
  success = false,
  warning = false,
  icon,
}) => {
  const status =
    error ? styles.error
    : success ? styles.success
    : warning ? styles.warning
    : styles.default;

  const hasIconStyle = icon
    ? styles.inputWithIcon
    : {};

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

  return (
    <Box
      position="relative"
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
        onChangeText={onChangeText}
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
  );
};

InputText.propTypes = {
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
};

export default InputText;
