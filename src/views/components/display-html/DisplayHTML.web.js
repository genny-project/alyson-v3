import React  from 'react';
import { string } from 'prop-types';

const DisplayHTML = ({ Html }) =>  { 
  return (
    <div
      dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
        __html: Html,
      }}
    />
  );
};

DisplayHTML.propTypes = { 
  Html: string,
};

DisplayHTML.defaultProps = { 
  Html: string,
};

export default DisplayHTML;
