import React from 'react';
import { string, number, oneOfType, object } from 'prop-types';
import { formatAddress } from '../../../utils';
import Text from '../text';

const Address = ({
  children,
  format,
  options,
  ...restProps
}) => (
  <Text
    {...restProps}
    testID="address"
  >
    {formatAddress(
      children,
      format,
      options,
    )}
  </Text>
);

Address.propTypes = {
  children: oneOfType(
    [number, string, object]
  ),
  format: string,
  options: object,
};

export default Address;
