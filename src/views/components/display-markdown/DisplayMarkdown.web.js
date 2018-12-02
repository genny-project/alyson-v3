import React from 'react';
import ReactMd from 'react-markdown';
import { object, string } from 'prop-types';

const DisplayMarkdown = ({ source, style }) => { 
  return (
    <ReactMd 
      styles={style}
      source={source}
    />
  );
};

DisplayMarkdown.propTypes = { 
  source: string, 
  style: object,
};

export default DisplayMarkdown;
