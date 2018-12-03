import React, { Component } from 'react';
import { string, bool } from 'prop-types';
import { formatPhoneNumber } from '../../../utils';
import { Text } from '../index';

class PhoneNumber extends Component {
  static defaultProps = {
    testID: 'phone-number',
  }

  static propTypes = {
    mobile: bool,
    landline: bool,
    children: string,
    number: string,
    testID: string,
  }

  render() {
    const {
      children,
      mobile,
      landline,
      number,
      testID,
      ...restProps
    } = this.props;

    return (
      <Text
        {...restProps}
        testID={testID}
      >
        {formatPhoneNumber( number || children, {
          mobile,
          landline,
        })}
      </Text>
    );
  }
}

export default PhoneNumber;
