import React from 'react';
import PDF from 'react-pdf-js';
import { string, object } from 'prop-types';

const PdfViewer = ({ file,style }) => { 
  return (
    <PDF
      style={{ ...style }}
      file={file}
    />
  );
};

PdfViewer.propTypes = { 
  file: string,
  style: object,
};

export default PdfViewer;
