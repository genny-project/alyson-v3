import React from 'react';
import HtmlPkg from 'react-native-render-html';
import { string } from 'prop-types';

const Html = ({ html, testID = 'display-html' }) =>  { 
  return (
    <HtmlPkg
      testID={testID}
      html={html}
    />
  );
};

Html.propTypes = { 
  html: string,
  testID: string,
};

export default Html;
