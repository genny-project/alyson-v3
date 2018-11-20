import React, { Component } from 'react';
import PDF from 'react-pdf-js';
import { string, object } from 'prop-types';

class  PdfViewer extends Component  {
  static propTypes = { 
    file: string,
    style: object,
  };

  render() {
    const { file, style } = this.props;

    return (
      <div
        style={{
          background: '#6b6b6b',
          height: 'auto',
          overflow: 'scroll',
          padding: '5% 8%',
          marginBottom: '30px',
        }}
      >
        {file !== 'undefined' && file != null ? (
          <PDF
            onDocumentComplete={this.handleDocumentComplete}
            style={{
              ...style }}
            file={file}
          />
        ) : 'File Not Found'}
      </div>
    );
  }
}

export default PdfViewer;
