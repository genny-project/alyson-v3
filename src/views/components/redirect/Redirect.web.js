import React from 'react';
import { Redirect as ReactRouterRedirect } from 'react-router-dom';
import { string } from 'prop-types';
import { removeStartingAndEndingSlashes } from '../../../utils';

const Redirect = ({ to }) => {
  const strippedTo = removeStartingAndEndingSlashes( to );

  const route = strippedTo === 'splash'
    ? `/${location.search}`
    : `/${strippedTo}`;

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
