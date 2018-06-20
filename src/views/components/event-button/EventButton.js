import React from 'react';
import { string, bool, any, func } from 'prop-types';
import { Bridge } from '../../../utils';
import { Button } from '../../components';

const EventButton = ({
  buttonCode = '',
  value = '',
  disabled = false,
  onPress,
  children,
  eventType = 'BTN_CLICK',
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

    Bridge.sendButtonEvent(
      eventType, {
        code: buttonCode,
        value: valueString || null,
      }
    );

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
  };

  return React.createElement(
    Button,
    addedProps,
    children
  );
};

EventButton.propTypes = {
  children: any,
  buttonCode: string.isRequired,
  value: string.isRequired,
  onPress: func,
  disabled: bool,
  eventType: string,
};

export default EventButton;
