import React from 'react';
import PDF from 'react-pdf-js';
import { string, object } from 'prop-types';

const PdfViewer = ({ file, style }) => {
  return (
    file ? (
      <PDF
        style={style}
        file={file}
      />
    ) : 'File Not Found'
  );
};

PdfViewer.propTypes = {
  file: string,
  style: object,
};

export default PdfViewer;
