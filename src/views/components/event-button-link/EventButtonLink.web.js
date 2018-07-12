
/**
 * Temporary component!
 *
 * I was in a rush so I needed to add this component and `EventButton`
 * to fix a few bugs in the application quickly.
 *
 * Please forgive me.
 */

import React from 'react';
import { Link as ReactRouterLink, browserHistory } from 'react-router-dom';
import { string, bool, any, func, object } from 'prop-types';
import { EventButton } from '../../components';

const EventButtonLink = ({
  disabled = false,
  onPress,
  children,
  to,
  decoration = 'none',
  ...restProps
}) => {
  const href = to === 'home'
    ? '/'
    : `/${to}`;

  const handleClick = event => {
    if ( disabled ) {
      event.preventDefault();
      event.stopPropagation();

      return false;
    }

    if ( onPress )
      onPress( event );
  };

  const handlePress = event => {
    if ( !disabled )
      browserHistory.push( to );

    handleClick( event );
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

  return (
    <ReactRouterLink
      {...restProps}
      to={href}
      onClick={handleClick}
      style={{
        ...restProps.style,
        textDecoration: decoration,
      }}
    >
      {
        React.createElement(
          EventButton,
          addedProps,
          children
        )
      }
    </ReactRouterLink>
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
