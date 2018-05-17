import React from 'react';
import { string, bool, any, func } from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import { Bridge } from '../../../utils/vertx';

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
    ) ? value
      : JSON.stringify( value );

    Bridge.sendBtnClick( 
      'BTN_CLICK', {
        buttonCode: buttonCode,
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

  return (
    <TouchableWithoutFeedback
      onPress={handlePress}
    >
      {children}
    </TouchableWithoutFeedback>
  );
};

EventLink.propTypes = {
  children: any,
  buttonCode: string.isRequired,
  value: string.isRequired,
  onPress: func,
  disabled: bool,
};

export default EventLink;
