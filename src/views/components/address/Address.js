import React from 'react';
import { string, number, oneOfType, object } from 'prop-types';
import { formatAddress } from '../../../utils';
import Text from '../text';

const Address = ({
  children,
  format,
  options,
  testID = 'address',
  ...restProps
}) => (
  <Text
    testID={testID}
    {...restProps}
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
  testID: string,
};

export default Address;
