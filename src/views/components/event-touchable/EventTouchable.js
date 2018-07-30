import React from 'react';
import { string, bool, any, func } from 'prop-types';
import { Bridge } from '../../../utils';
import { Touchable } from '../../components';

const EventTouchable = ({
  buttonCode = '',
  value = '',
  onPress,
  disabled,
  children,
  eventType = 'BTN_CLICK',
  messageType = 'BTN',
  showSpinnerOnClick = true,
  ...restProps
}) => {
  const handlePress = event => {
    if ( disabled ) {
      event.preventDefault();
      event.stopPropagation();

      return false;
    }

    const valueString = (
      value &&
      typeof value === 'string'
    )
      ? value
      : JSON.stringify( value );

    Bridge.sendEvent({
      event: messageType,
      eventType,
      sendWithToken: true,
      data: {
        code: buttonCode,
        value: valueString || null,
      },
    });

    if ( onPress )
      onPress( event );
  };

  if ( typeof children === 'function' ) {
    return children({
      onPress: handlePress,
    });
  }

  const addedProps = {
    ...restProps,
    onPress: handlePress,
    showSpinnerOnClick,
  };

  return React.createElement(
    Touchable,
    addedProps,
    children
  );
};

EventTouchable.propTypes = {
  children: any,
  buttonCode: string.isRequired,
  value: string.isRequired,
  onPress: func,
  disabled: bool,
  eventType: string,
  messageType: string,
  showSpinnerOnClick: bool,
};

export default EventTouchable;
