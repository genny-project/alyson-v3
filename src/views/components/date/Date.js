import React from 'react';
import { string, number, oneOfType, object } from 'prop-types';
import { formatDate } from '../../../utils';
import Text from '../text';

const Date = ({
  children,
  format = 'HH:mm DDDD MMMM Do, YYYY',
  options,
  date,
  testID = 'date',
  ...restProps
}) => (
  <Text
    testID={testID}
    {...restProps}
  >
    {formatDate( date || children, format, options )}
  </Text>
);

Date.propTypes = {
  children: oneOfType(
    [number, string, object]
  ),
  format: string,
  options: object,
  date: string,
  testID: string,
};

export default Date;
