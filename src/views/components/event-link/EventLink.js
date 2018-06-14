import React from 'react';
import { string, bool, any, func } from 'prop-types';
import { Bridge } from '../../../utils';

const EventLink = ({
  children = 'Event',
  buttonCode = '',
  value = '',
  disabled = false,
  onPress,
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
      'BTN_CLICK', {
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

  return React.Children.map( children, child => (
    React.cloneElement( child, {
      ...child.props,
      onPress: handlePress,
    })
  ));
};

EventLink.propTypes = {
  children: any,
  buttonCode: string.isRequired,
  value: string.isRequired,
  onPress: func,
  disabled: bool,
};

export default EventLink;
