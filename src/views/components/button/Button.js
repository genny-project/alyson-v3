import React, { Component, createElement } from 'react';
import { Platform, ActivityIndicator, TouchableNativeFeedback } from 'react-native';
import { string, bool, func, oneOf, number, oneOfType, shape, arrayOf, object } from 'prop-types';
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
  }

  static propTypes = {
    children: string,
    text: string,
    disabled: bool,
    onPress: func,
    color: string,
    textColor: string,
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
    inverted: bool,
    theme: shape({
      components: object,
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

  handlePressAttempt = event => {
    const { confirmation } = this.props;

    if ( confirmation ) {
      alert({
        title: confirmation.title,
        message: confirmation.message,
        buttons: confirmation.buttons && (
          confirmation.buttons.map( button => ({
            ...button,
            onPress: (
              ( button.type === 'ok' ) ? () => this.handlePress( event )
              : ( button.type === 'cancel' ) ? () => {}
              : () => {}
            ),
          }))
        ),
      });
    }
    else {
      this.handlePress( event );
    }
  }

  handlePress = event => {
    const { showSpinnerOnClick, onPress } = this.props;

    if ( showSpinnerOnClick )
      this.setState({ isSpinning: true });

    if ( onPress )
      onPress( event );
  }

  renderIconChild() {
    const { textColor, color, icon, size } = this.props;
    const themeConfig = this.getThemeConfig();

    const actualColor = textColor || (
      themeConfig.textColors &&
      themeConfig.textColors[color]
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
    const { textColor, color, children, size, text, fontWeight, inverted } = this.props;
    const themeConfig = this.getThemeConfig();

    const actualColor = textColor || (
      inverted ? color : (
        themeConfig.textColors &&
        themeConfig.textColors[color]
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
    const { size, color, children, text, icon } = this.props;
    const themeConfig = this.getThemeConfig();

    const actualBackgroundColor = (
      themeConfig.buttonColors &&
      themeConfig.buttonColors[color]
    );

    const activityIndicatorSize = (
      themeConfig.activityIndicatorSizes &&
      themeConfig.activityIndicatorSizes[size]
    );

    const activityIndicatorColor = (
      themeConfig.textColors &&
      themeConfig.textColors[color]
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
    } = this.props;

    const { isSpinning } = this.state;
    const themeConfig = this.getThemeConfig();

    const actualBackgroundColor = (
      inverted ? 'transparent'
      : themeConfig.buttonColors && (
        (
          disabled &&
          themeConfig.buttonColors.disabled
        )
          ? themeConfig.buttonColors.disabled
          : themeConfig.buttonColors[color]
      )
    );

    const actualBorderColor = (
      themeConfig.buttonColors && (
        (
          disabled &&
          themeConfig.buttonColors.disabled
        )
          ? themeConfig.buttonColors.disabled
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
    } = this.props;

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

    return createElement(
      Touchable,
      {
        style,
        disabled: (
          disabled ||
          isSpinning ||
          submitting
        ),
        onPress: this.handlePressAttempt,
        accessible,
        accessibilityLabel,
        accessibilityRole,
        background: (
          Platform.OS === 'android'
            ? TouchableNativeFeedback.Ripple( androidTouchColor || '#FFF', false )
            : undefined
        ),
        withFeedback,
      },
      this.renderChildWrapper()
    );
  }
}

export default withTheme( Button );
