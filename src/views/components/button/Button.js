import React, { Component, createElement } from 'react';
import { Platform, ActivityIndicator, TouchableNativeFeedback } from 'react-native';
import { string, bool, func, oneOf, number, oneOfType, shape, arrayOf } from 'prop-types';
import { Text, Icon, Box, Touchable, alert } from '../index';

const buttonColors = {
  red: 'red',
  green: 'green',
  blue: 'blue',
  white: 'white',
  transparent: 'transparent',
  disabled: 'lightgrey',
  black: 'black',
};

const textColors = {
  red: 'white',
  green: 'white',
  blue: 'white',
  white: 'black',
  transparent: 'black',
  disabled: 'white',
  black: 'white',
};

const textSizes = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

const sizeMapping = {
  sm: 'small',
  md: 'small',
  lg: 'large',
};

const iconOnlyButtonSizes = {
  sm: 40,
  md: 50,
  lg: 60,
};

const paddingSizes = {
  sm: {
    paddingX: 15,
    paddingY: 10,
  },
  md: {
    paddingX: 20,
    paddingY: 15,
  },
  lg: {
    paddingX: 25,
    paddingY: 20,
  },
};

class Button extends Component {
  static defaultProps = {
    color: 'black',
    size: 'lg',
    accessible: true,
    withFeedback: true,
    isSpinning: false,
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
    borderWidth: number,
    borderColor: string,
    inverted: bool,
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

    return (
      <Icon
        color={textColor || textColors[color]}
        name={icon}
        size={size}
      />
    );
  }

  renderTextChild() {
    const { textColor, color, children, size, text, fontWeight, inverted } = this.props;

    return (
      <Text
        color={(
          textColor || (
            inverted ? color
            : textColors[color]
          )
        )}
        decoration="none"
        size={textSizes[size]}
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
          backgroundColor={buttonColors[color] || color}
          opacity={0.8}
          shape={isIconOnly && 'circle'}
        />

        <ActivityIndicator
          size={sizeMapping[size]}
          color={textColors[color]}
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

    const isIconOnly = (
      typeof icon === 'string' &&
      children == null &&
      text == null
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
        backgroundColor={(
          inverted ? 'transparent'
          : disabled ? buttonColors.disabled
          : buttonColors[color] || color
        )}
        width={(
          isIconOnly &&
          shape === 'circle'
        )
          ? iconOnlyButtonSizes[size]
          : width}
        height={(
          isIconOnly &&
          shape === 'circle'
        )
          ? iconOnlyButtonSizes[size]
          : height}
        {...inverted && {
          borderStyle: 'solid',
          borderWidth: 2,
          borderColor: (
            disabled ? buttonColors.disabled
            : buttonColors[color] || color
          ),
        }}
      >
        <Box
          padding={padding}
          paddingX={(
            paddingX == null &&
            !isIconOnly
          )
            ? paddingSizes[size].paddingX
            : paddingX}
          paddingY={(
            paddingY == null &&
            !isIconOnly
          )
            ? paddingSizes[size].paddingY
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
      borderWidth,
      borderColor,
    } = this.props;

    const { isSpinning } = this.state;

    const style = {
      height,
      width,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
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
            ? TouchableNativeFeedback.Ripple( textColors[color], false )
            : undefined
        ),
        withFeedback,
      },
      this.renderChildWrapper()
    );
  }
}

export default Button;
