import React from 'react';
import { string, number, oneOfType, object } from 'prop-types';
import { formatDate } from '../../../utils';
import Text from '../text';

const Date = ({
  children,
  format = 'HH:mm DDDD MMMM Do, YYYY',
  options,
  ...restProps
}) => (
  <Text {...restProps}>
    {formatDate( children, format, options )}
  </Text>
);

Date.propTypes = {
  children: oneOfType(
    [number, string, object]
  ),
  format: string,
  options: object,
};

export default Date;
