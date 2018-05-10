import React from 'react';
import { Text } from 'prop-types';
import { string } from 'prop-types';

const Toast = ({
    text,
    toastType,

}) => {
    return (
      <div>
        {text}
      </div>
    );
};

export default Toast;
