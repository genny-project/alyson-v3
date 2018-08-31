import React from 'react';
import ReactMd from 'react-native-markdown-renderer';
import { string } from 'prop-types';

const DisplayMarkdown = ({ source }) => { 
  return (
    <ReactMd> 
      {source}
    </ReactMd>
  );
};

DisplayMarkdown.propTypes = { 
  source: string,
};

export default DisplayMarkdown;
