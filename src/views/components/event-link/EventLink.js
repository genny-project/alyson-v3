import React from 'react';
import { string, bool, any, func } from 'prop-types';
import { Bridge } from '../../../utils';
import { Link } from '../index';

const EventLink = ({
  children = 'Event',
  buttonCode = '',
  value = '',
  disabled = false,
  onPress,
  to,
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
      'ROUTE_CHANGE', {
        code: to || buttonCode,
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

  return React.Children.map( children, child => {
    if ( to ) {
      return React.createElement( Link, {
        ...this.props,
        buttonCode: buttonCode,
        value: value,
        disabled: disabled,
        to: to,
        onPress: handlePress,
      }, child );
    }

    return React.cloneElement( child, {
      ...child.props,
      onPress: handlePress,
    });
  });
};

EventLink.propTypes = {
  children: any,
  buttonCode: string.isRequired,
  value: string.isRequired,
  onPress: func,
  disabled: bool,
  to: string,
};

export default EventLink;
