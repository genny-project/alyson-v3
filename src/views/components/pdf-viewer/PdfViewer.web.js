import React from 'react';
import { oneOfType, string, number, object } from 'prop-types';
import { Box } from '../../components';

const  Pdf  = ({ height =  '600px', width = '600px', file = null, ...restProps }) => {
  return (
    <Box
      height={height}
      width={width}
      {...restProps}
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
    </Box>
  );
};

Pdf.propTypes = {
  width: oneOfType( [number, string] ),
  height: oneOfType( [number, string] ), 
  style: object,
  file: string,
};

export default Pdf;

