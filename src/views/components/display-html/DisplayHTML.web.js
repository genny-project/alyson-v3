import React  from 'react';
import { string } from 'prop-types';

const Html = ({ html }) =>  { 
  return (
    <div
      testID="display-html"
      dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
        __html: html,
      }}
    />
  );
};

Html.propTypes = { 
  html: string,
};

export default Html;
