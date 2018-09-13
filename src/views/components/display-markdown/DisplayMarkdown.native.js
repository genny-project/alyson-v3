import React from 'react';
import ReactMd from 'react-native-markdown-renderer';
import { string, object } from 'prop-types';

const DisplayMarkdown = ({ source, style = { backgroundColor: '#fff' } }) => { 
  return (
    <ReactMd
      style={style}
    >
      {source}
    </ReactMd>
  );
};

DisplayMarkdown.propTypes = { 
  source: string,
  style: object,
};

export default DisplayMarkdown;
