import React  from 'react';
import { string } from 'prop-types';

const Html = ({ html, testID = 'display-html' }) =>  { 
  return (
    <div
      testID={testID}
      dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
        __html: html,
      }}
    />
  );
};

Html.propTypes = { 
  html: string,
  testID: string,
};

export default Html;
