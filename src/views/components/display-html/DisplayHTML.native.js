import React from 'react';
import HtmlPkg from 'react-native-render-html';
import { string } from 'prop-types';

const DisplayHTML = ({ Html }) =>  { 
  return (
    <HtmlPkg
      html={Html}
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
