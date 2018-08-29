import React from 'react';
import HtmlPkg from 'react-native-render-html';
import { string } from 'prop-types';

const Html = ({ html }) =>  { 
  return (
    <HtmlPkg
      html={html}
    />
  );
};

Html.propTypes = { 
  html: string,
};

export default Html;
