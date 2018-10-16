import React from 'react';
import { string, number, oneOfType, object } from 'prop-types';
import { formatCurrency } from '../../../utils';
import Text from '../text';

const Currency = ({
  children,
  format,
  options,
  ...restProps
}) => (
  <Text
    testID="currency"
    {...restProps}
  >
    {formatCurrency(
      children,
      format,
      options,
    )}
  </Text>
);

Currency.propTypes = {
  children: oneOfType(
    [number, string, object]
  ),
  format: string,
  options: object,
};

export default Currency;
