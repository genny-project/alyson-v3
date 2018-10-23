import React, { Fragment as ReactFragment } from 'react';
import { node, string } from 'prop-types';

const Fragment = ({ children, key }) => {
  return (
    <ReactFragment key={key}>
      {children}
    </ReactFragment>
  );
};

Fragment.propTypes = {
  children: node,
  key: string,
};

export default Fragment;
