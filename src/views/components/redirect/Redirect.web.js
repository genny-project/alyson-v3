import React from 'react';
import { Redirect as ReactRouterRedirect } from 'react-router-dom';
import { string } from 'prop-types';

const Redirect = ({ to }) => {
  const route = to === 'home'
    ? '/'
    : `/${to}`;

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
