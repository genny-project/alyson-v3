import React from 'react';
import { string, bool } from 'prop-types';
import { formatPhoneNumber } from '../../../utils';
import Text from '../text';

const PhoneNumber = ({
  children,
  mobile,
  landline,
  number,
  ...restProps
}) => (
  <Text {...restProps}>
    {formatPhoneNumber( number || children, {
      mobile,
      landline,
    })}
  </Text>
);

PhoneNumber.propTypes = {
  mobile: bool,
  landline: bool,
  children: string,
  number: string,
};

export default PhoneNumber;
