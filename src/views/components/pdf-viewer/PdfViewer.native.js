import React from 'react';
import { string, object } from 'prop-types';
import Pdf from 'react-native-pdf';

const PdfViewer = ({ file,style }) => { 
  return (
    file ? (
      <Pdf
        source={{ uri: file }}
        style={{ ...defaultStyle, ...style }}
      />
    ) : 
      'File Not Found'
  );
};

const defaultStyle = { 
  height: 400, 
  width: '100%',
};

PdfViewer.propTypes = { 
  file: string,
  style: object,
};

export default PdfViewer;
