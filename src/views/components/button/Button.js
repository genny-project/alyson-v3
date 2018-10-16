import React, { Component } from 'react';
import { Platform, ActivityIndicator, TouchableNativeFeedback } from 'react-native';
import { string, bool, func, oneOf, number, oneOfType, shape, arrayOf, object, any } from 'prop-types';
import { Text, Icon, Box, Touchable, alert } from '../index';
import { withTheme } from '../theme';
import defaultThemeConfig from './defaultThemeConfig.json';
import defaultThemes from './defaultThemes.json';

class Button extends Component {
  static defaultProps = {
    accessible: true,
    isSpinning: false,
    size: 'md',
    withFeedback: true,
    testID: 'button',
  }

  static propTypes = {
    children: string,
    text: string,
    testID: string,
    disabled: bool,
    onPress: func,
    color: string,
    textColor: string,
    colorDisabled: string,
    textColorDisabled: string,
    fontWeight: string,
    icon: string,
    size: oneOf(
      ['sm', 'md', 'lg']
    ),
    padding: number,
    paddingX: number,
    paddingY: number,
    accessibilityLabel: string,
    accessibilityRole: string,
    accessible: bool,
    width: oneOfType(
      [number, string]
    ),
    height: oneOfType(
      [number, string]
    ),
    showSpinnerOnClick: bool,
    withFeedback: bool,
    shape: string,
    boxShadow: string,
    submitting: bool,
    confirmation: shape({
      message: string,
      title: string,
      buttons: arrayOf(
        shape({
          type: oneOf(
            ['ok', 'cancel', 'no']
          ),
          style: oneOf(
            ['default', 'cancel', 'destructive']
          ),
          text: string,
        }),
      ),
    }),
    isSpinning: bool,
    marginTop: number,
    marginBottom: number,
    marginLeft: number,
    marginRight: number,
    marginX: number,
    borderWidth: number,
    borderColor: string,
    borderColorDisabled: string,
    inverted: bool,
    theme: shape({
      components: object,
    }),
    hoverProps: object,
    onMouseEnter: func,
    onMouseLeave: func,
    isBackButton: bool,
    dispatchActionOnClick: shape({
      type: string.isRequired,
      payload: any,
    }),
  }

  static getDerivedStateFromProps( props, state ) {
    if (
      props.isSpinning != null &&
      props.isSpinning !== state.isSpinning
    ) {
      return { isSpinning: props.isSpinning };
    }

    return null;
  }

  state = {
    isSpinning: this.props.isSpinning,
    isHovering: false,
  }

  getProps() {
    const { hoverProps } = this.props;
    const { isHovering } = this.state;

    if ( isHovering ) {
      return {
        ...this.props,
        ...hoverProps,
      };
    }

    return this.props;
  }

  getThemes() {
    const { button } = this.props.theme.components;

    return button || defaultThemes;
  }

  getThemeConfig() {
    const { config } = this.getThemes();

    return config || defaultThemeConfig;
  }

  setSpinning = isSpinning => {
    this.setState({ isSpinning });
  }

  handleMouseEnter = event => {
    this.setState({ isHovering: true });

    if ( this.props.onMouseEnter )
      this.props.onMouseEnter( event );
  }

  handleMouseLeave = () => {
    this.setState({ isHovering: false });

    if ( this.props.onMouseLeave )
      this.props.onMouseLeave( event );
  }

  handlePressAttempt = event => {
    const { confirmation } = this.props;

    if ( confirmation ) {
      alert({
        title: confirmation.title,
        message: confirmation.message,
        buttons: confirmation.buttons && (
          confirmation.buttons.map( button => ({
            ...button,
            onPress: ( type ) => (
              ( button.type === 'ok' || ( type && type === 'ok' )) ? this.handlePress( event )
              : ( button.type === 'cancel' ) ? () => {}
              : () => {}
            ),
          }))),
      });
    }
    else {
      this.handlePress( event );
    }
  }

  handlePress = event => {
    const { showSpinnerOnClick, onPress, isBackButton, onBack } = this.getProps();

    if ( isBackButton && onBack )
      onBack();

    if ( showSpinnerOnClick )
      this.setState({ isSpinning: true });

    if ( onPress )
      onPress( event );
  }

  renderIconChild() {
    const { textColor, color, icon, size, disabled, textColorDisabled } = this.getProps();
    const themeConfig = this.getThemeConfig();

    const actualColor = disabled
      ? textColorDisabled
      : textColor || (
        themeConfig.textColors &&
        themeConfig.textColors[disabled &&
        textColorDisabled ||
        color]
      );

    return (
      <Icon
        color={actualColor}
        name={icon}
        size={size}
      />
    );
  }

  renderTextChild() {
    const {
      textColor,
      color,
      children,
      size,
      text,
      fontWeight,
      inverted,
      disabled,
      colorDisabled,
    } = this.getProps();
    const themeConfig = this.getThemeConfig();

    const actualColor = textColor || (
      inverted
        ? disabled
          ? colorDisabled
          : color
        : (
          themeConfig.textColors &&
          themeConfig.textColors[disabled &&
          colorDisabled ||
          color]
        )
    );

    const actualSize = (
      themeConfig.textSizes &&
      themeConfig.textSizes[size]
    );

    return (
      <Text
        color={actualColor}
        decoration="none"
        size={actualSize}
        align="center"
        width="100%"
        bold={!fontWeight}
        fontWeight={fontWeight}
      >
        {text || children}
      </Text>
    );
  }

  renderSpinnerChild() {
    const { size, color, children, text, icon, disabled, colorDisabled } = this.getProps();
    const themeConfig = this.getThemeConfig();

    const actualBackgroundColor = (
      themeConfig.buttonColors &&
      themeConfig.buttonColors[disabled &&
        colorDisabled ||
        color]
    );

    const activityIndicatorSize = (
      themeConfig.activityIndicatorSizes &&
      themeConfig.activityIndicatorSizes[size]
    );

    const activityIndicatorColor = (
      themeConfig.textColors &&
      themeConfig.textColors[disabled &&
        colorDisabled ||
        color]
    );

    const isIconOnly = (
      typeof icon === 'string' &&
      children == null &&
      text == null
    );

    return (
      <Box
        position="absolute"
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
        shape={isIconOnly && 'circle'}
      >
        <Box
          position="absolute"
          width="100%"
          height="100%"
          backgroundColor={actualBackgroundColor || color}
          opacity={0.8}
          shape={isIconOnly && 'circle'}
        />

        <ActivityIndicator
          size={activityIndicatorSize}
          color={activityIndicatorColor}
        />
      </Box>
    );
  }

  renderChildWrapper() {
    const {
      disabled,
      color,
      colorDisabled,
      padding,
      paddingX,
      paddingY,
      size,
      icon,
      children,
      shape,
      width,
      height,
      text,
      boxShadow,
      submitting,
      inverted,
      testID,
    } = this.getProps();

    const { isSpinning } = this.state;
    const themeConfig = this.getThemeConfig();

    const actualBackgroundColor = (
      inverted
        ? 'transparent'
        : themeConfig.buttonColors && (
          disabled && (
            colorDisabled &&
            themeConfig.buttonColors[colorDisabled] ||
            themeConfig.buttonColors.disabled
          ) ||
          themeConfig.buttonColors[color]
        )
    );

    const actualBorderColor = (
      themeConfig.buttonColors && (
        (
          disabled &&
          themeConfig.buttonColors.disabled
        )
          ? colorDisabled
            ? themeConfig.buttonColors[colorDisabled]
            : themeConfig.buttonColors.disabled
          : themeConfig.buttonColors[color]
      )
    );

    const isIconOnly = (
      typeof icon === 'string' &&
      children == null &&
      text == null
    );

    const iconOnlySize = (
      themeConfig.iconOnlySizes &&
      themeConfig.iconOnlySizes[size]
    );

    const paddingSize = (
      themeConfig.paddingSizes &&
      themeConfig.paddingSizes[size]
    );

    /* TODO: mixed icon and text children */
    const child =
      isIconOnly ? this.renderIconChild()
      : ( text || typeof children === 'string' ) ? this.renderTextChild()
      : children || null;

    return (
      <Box
        testID={testID}
        cleanStyleObject
        position="relative"
        shape={shape}
        justifyContent="center"
        alignItems="center"
        boxShadow={boxShadow}
        backgroundColor={actualBackgroundColor || color}
        width={width || (
          isIconOnly &&
          shape === 'circle' &&
          iconOnlySize
        ) || null}
        height={height || (
          isIconOnly &&
          shape === 'circle' &&
          iconOnlySize
        ) || null}
        {...inverted && {
          borderStyle: themeConfig.invertedBorderStyle || 'solid',
          borderWidth: themeConfig.invertedBorderWidth || 2,
          borderColor: actualBorderColor || color,
        }}
      >
        <Box
          padding={padding}
          paddingX={(
            paddingX == null &&
            !isIconOnly &&
            paddingSize
          )
            ? paddingSize.paddingX
            : paddingX}
          paddingY={(
            paddingY == null &&
            !isIconOnly &&
            paddingSize
          )
            ? paddingSize.paddingY
            : paddingY}
        >
          {child}
        </Box>

        {(
          isSpinning ||
          submitting
        )
          ? this.renderSpinnerChild()
          : null}
      </Box>
    );
  }

  render() {
    const {
      disabled,
      color,
      withFeedback,
      accessible,
      accessibilityLabel,
      accessibilityRole,
      width,
      height,
      submitting,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      marginX,
      borderWidth,
      borderColor,
      dispatchActionOnClick,
    } = this.getProps();

    const { isSpinning } = this.state;
    const themeConfig = this.getThemeConfig();

    const androidTouchColor = (
      themeConfig.textColors &&
      themeConfig.textColors[color]
    );

    const style = {
      height,
      width,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      marginX,
      borderWidth,
      borderColor,
    };

    return (
      <Touchable
        withFeedback={withFeedback}
        style={style}
        disabled={(
          disabled ||
          isSpinning ||
          submitting
        )}
        onPress={this.handlePressAttempt}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        accessible={accessible}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
        background={(
          Platform.OS === 'android'
            ? TouchableNativeFeedback.Ripple( androidTouchColor || '#FFF', false )
            : undefined
        )}
        dispatchActionOnClick={dispatchActionOnClick}
      >
        {this.renderChildWrapper()}
      </Touchable>
    );
  }
}

export default withTheme( Button );
