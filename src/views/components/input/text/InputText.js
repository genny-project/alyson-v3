import React from 'react';
import { TextInput } from 'react-native';
import { string, oneOf, number, shape, bool, func } from 'prop-types';
import { Box, Icon } from '../../../components';
import styles from './InputText.style';

const InputText = ({
  autoCapitalize,
  autoComplete,
  autoCorrect,
  autoFocus,
  blurOnSubmit,
  clearTextOnFocus,
  defaultValue,
  editable,
  keyboardType,
  maxLength,
  multiline,
  onBlur,
  onChange,
  onChangeText,
  onFocus,
  onKeyPress,
  onLayout,
  onSelectionChange,
  onSubmitEditing,
  placeholder,
  placeholderTextColor,
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
  value,
  error,
  success,
  warning,
  icon,
}) => {
  const inputStyle = {
    margin,
    marginHorizontal: marginX,
    marginVertical: marginY,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    ...error && styles.error,
    ...success && styles.success,
    ...warning && styles.warning,
    ...icon && styles.inputWithIcon,
  };

  const iconColor =
    !editable ? 'lightGrey'
    : success ? 'green'
    : error ? 'red'
    : warning ? 'yellow'
    : 'grey';

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
        editable={editable}
        keyboardType={keyboardType}
        maxLength={maxLength}
        multiline={multiline}
        onBlur={onBlur}
        onChange={onChange}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onKeyPress={onKeyPress}
        onLayout={onLayout}
        onSelectionChange={onSelectionChange}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={secureTextEntry}
        selection={selection}
        selectTextOnFocus={selectTextOnFocus}
        spellCheck={spellCheck}
        style={[
          styles.input,
          inputStyle,
        ]}
        value={value}
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
            color={iconColor}
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
  editable: bool,
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
  placeholderTextColor: string,
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
};

export default InputText;
