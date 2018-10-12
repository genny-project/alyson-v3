import React, { Component } from 'react';
import { string, bool } from 'prop-types';
import { formatPhoneNumber } from '../../../utils';
import { Text } from '../index';

class PhoneNumber extends Component {
  static propTypes = {
    mobile: bool,
    landline: bool,
    children: string,
    number: string,
  }

  render() {
    const {
      children,
      mobile,
      landline,
      number,
      ...restProps
    } = this.props;

    return (
      <Text {...restProps}>
        {formatPhoneNumber( number || children, {
          mobile,
          landline,
        })}
      </Text>
    );
  }
}

export default PhoneNumber;
