import React from 'react';
import { string, object } from 'prop-types';
import Pdf from 'react-native-pdf';

const PdfViewer = ({ file,style }) => { 
  return (
    <Pdf
      source={file}
      style={{ ...style }} 
    />
  );
};

PdfViewer.propTypes = { 
  file: string,
  style: object,
};

export default PdfViewer;
