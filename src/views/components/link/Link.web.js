import React from 'react';
import { Link as ReactRouterLink, withRouter } from 'react-router-dom';
import { string, bool, any, func, oneOf, object } from 'prop-types';
import { withKeycloak } from '../keycloak';
import { Touchable } from '../index';

const Link = ({
  children = 'Link',
  to,
  disabled = false,
  onPress,
  history,
  decoration = 'none',
  wrapperProps = {},
  withFeedback = true,
  ...restProps
}) => {
  const href = (
    to === 'home' ? '/'
    : to.startsWith( '/' ) ? to
    : `/${to}`
  );

  const handleClick = event => {
    if ( disabled ) {
      event.preventDefault();
      event.stopPropagation();

      return false;
    }

    if ( onPress )
      onPress( event );
  };

  const handleNavigate = event => {
    if ( !disabled )
      history.push( to );

    handleClick( event );
  };

  if ( typeof children === 'function' ) {
    return children({
      onPress: handleNavigate,
    });
  }

  return (
    <ReactRouterLink
      {...wrapperProps}
      to={href}
      onClick={handleClick}
      style={{
        ...wrapperProps.style,
        textDecoration: decoration,
      }}
    >
      <Touchable
        {...restProps}
        withFeedback={withFeedback}
      >
        {children}
      </Touchable>
    </ReactRouterLink>
  );
};

Link.propTypes = {
  children: any,
  to: string.isRequired,
  disabled: bool,
  onPress: func,
  decoration: oneOf(
    ['none', 'underline', 'line-through']
  ),
  history: object,
  wrapperProps: object,
  withFeedback: bool,
};

export default withKeycloak( withRouter( Link ));
