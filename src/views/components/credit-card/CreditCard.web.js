import React, { Component } from 'react';
import { string } from 'prop-types';
import { Box, Text } from '../../components';

class CreditCard extends Component {
  static defaultProps = {
    testID: 'credit-card-view',
  }

  static propTypes = {
    testID: string,
  }

  render() {
    const { testID } = this.props;
    
    return (
      <Box testID={testID}>
        <Text>
          TODO Credit Card
        </Text>
      </Box>
    );
  }
}

export default CreditCard;
