import React from 'react';
import { oneOfType, string, number, object } from 'prop-types';

const  Pdf  = ({ style = {}, height =  '600px', width = '600px', file = null }) => {
  const componentStyle = style;

  return (
    <div
      style={
            { height: height, width: width, ...componentStyle  }
          }
    >
      { file !== null && file !== undefined && file !== 'undefined' ? (
        <iframe
          title="pdf-document"
          src={file}
          width="100%"
          height="100%"
        />
      ) : 'Pdf Document Loading Please Wait'
        }
    </div>
  );
};

Pdf.propTypes = { 
  width: oneOfType( [number, string] ),
  height: oneOfType( [number, string] ), 
  style: object,
  file: string,
};

export default Pdf;

