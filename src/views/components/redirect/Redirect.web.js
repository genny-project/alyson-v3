import React from 'react';
import { Redirect as ReactRouterRedirect } from 'react-router-dom';
import { string, bool } from 'prop-types';

const Redirect = ({ to, removeRedirectURL = false }) => {
  let route = to === 'splash'
    ? '/'
    : `/${to}`;

  if ( location.search && !removeRedirectURL )
    route += location.search;

  return (
    <ReactRouterRedirect
      to={route}
    />
  );
};

Redirect.propTypes = {
  to: string.isRequired,
  removeRedirectURL: bool,
};

export default Redirect;
