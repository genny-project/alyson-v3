import React, { Component } from 'react';
import { string } from 'prop-types';
import { Text } from '../index';

class EmailAddress extends Component {
  static propTypes = {
    emailAddress: string,
    children: string,
  }

  render() {
    const {
      children,
      emailAddress,
      ...restProps
    } = this.props;

    return (
      <Text
        testID="email-address"
        {...restProps}
      >
        { emailAddress ||  children }
      </Text>
    );
  }
}

export default EmailAddress;
