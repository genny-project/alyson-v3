import React from 'react';
import { Redirect as ReactRouterRedirect } from 'react-router-dom';
import { string } from 'prop-types';

const Redirect = ({ to }) => {
  let route = to === 'home'
    ? '/'
    : `/${to}`;

  if ( location.search )
    route += location.search;

  return (
    <ReactRouterRedirect
      to={route}
    />
  );
};

Redirect.propTypes = {
  to: string.isRequired,
};

export default Redirect;
