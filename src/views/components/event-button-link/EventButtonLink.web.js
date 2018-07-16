
/**
 * Temporary component!
 *
 * I was in a rush so I needed to add this component and `EventButton`
 * to fix a few bugs in the application quickly.
 *
 * Please forgive me.
 */

import React from 'react';
import { string, bool, any, func, object } from 'prop-types';
import { EventButton, Link } from '../../components';

const EventButtonLink = ({
  disabled = false,
  onPress,
  children,
  to,
  ...restProps
}) => {
  const handlePress = event => {
    if ( onPress )
      onPress( event );
  };

  const handlePressAttempt = event => {
    if ( disabled ) {
      event.preventDefault();
      event.stopPropagation();

      return false;
    }

    handlePress( event );
  };

  if ( typeof children === 'function' ) {
    return children({
      onPress: handlePressAttempt,
    });
  }

  const addedProps = {
    ...restProps,
    onPress: handlePressAttempt,
  };

  return (
    <Link
      disabled={disabled}
      to={to}
    >
      {React.createElement(
        EventButton,
        addedProps,
        children
      )}
    </Link>
  );
};

EventButtonLink.propTypes = {
  children: any,
  buttonCode: string.isRequired,
  value: string.isRequired,
  onPress: func,
  disabled: bool,
  useAppNavigator: bool,
  navigation: object,
  params: object,
  to: string,
  decoration: string,
};

export default EventButtonLink;
