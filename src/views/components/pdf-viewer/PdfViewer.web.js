import React from 'react';
import PDF from 'react-pdf-js';
import { string, object } from 'prop-types';

const PdfViewer = ({ file,style }) => { 
  return (
    file ? (
      <PDF
        style={{ ...defaultStyle, ...style }}
        file={file}
      />
    ) : 'File Not Found'
  );
};

const defaultStyle = {
  height: 400, 
  width: 400,
};

PdfViewer.propTypes = { 
  file: string,
  style: object,
};

export default PdfViewer;
