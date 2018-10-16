import React, { Component } from 'react';
import { string } from 'prop-types';
import { Text } from '../index';

class EmailAddress extends Component {
  static defaultProps = {
    testID: 'email-address',
  }
  
  static propTypes = {
    emailAddress: string,
    children: string,
    testID: string,
  }

  render() {
    const {
      children,
      emailAddress,
      testID,
      ...restProps
    } = this.props;

    return (
      <Text
        testID={testID}
        {...restProps}
      >
        { emailAddress ||  children }
      </Text>
    );
  }
}

export default EmailAddress;
