import React from 'react';
import { Link as ReactRouterLink, withRouter } from 'react-router-dom';
import { string, bool, any, func, oneOf, object } from 'prop-types';

const Link = ({
  children = 'Link',
  to,
  disabled = false,
  onPress,
  decoration = 'none',
  history,
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
      {...restProps}
      to={href}
      onClick={handleClick}
      style={{
        ...restProps.style,
        textDecoration: decoration,
      }}
    >
      {children}
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
};

export default withRouter( Link );
