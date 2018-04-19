import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { string, bool, any, func } from 'prop-types';

const Link = ({
  children = 'Link',
  href,
  disabled,
  onClick,
  ...restProps
}) => {
  const route = href === 'home'
    ? '/'
    : `/${href}`;

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
      to={route}
      onClick={handleClick}
    >
      {children}
    </ReactRouterLink>
  );
};

Link.propTypes = {
  children: any,
  href: string,
  disabled: bool,
  onClick: func,
};

export default Link;
