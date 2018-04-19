import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { string, bool, any, func, oneOf } from 'prop-types';

const Link = ({
  children = 'Link',
  to,
  disabled = false,
  onClick,
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

    if ( onClick )
      onClick( event );
  };

  return (
    <ReactRouterLink
      {...restProps}
      to={href}
      onClick={handleClick}
      style={{
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
  onClick: func,
  decoration: oneOf(
    ['none', 'underline', 'line-through']
  ),
};

export default Link;
