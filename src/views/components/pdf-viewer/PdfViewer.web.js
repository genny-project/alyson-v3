import React from 'react';
import { string } from 'prop-types';
import { Box } from '../index';

const PdfViewer = ({ file, emptyProps }) => {
  if ( !file ) {
    return (
      <Box {...emptyProps} />
    );
  }

  return (
    <iframe
      src={file}
      width="100%"
      height="100%"
    />
  );
};

PdfViewer.propTypes = {
  file: string.isRequired,
};

export default PdfViewer;
