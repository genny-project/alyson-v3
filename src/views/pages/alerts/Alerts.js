import React, { Component } from 'react';
import { string } from 'prop-types';
import { Text, Box, Input } from '../../components';
import Layout from '../../layout';

class Alerts extends Component {
  static defaultProps = {
    testID: 'alerts',
  }

  static propTypes = {
    testID: string,
  }

  render() {
    const { testID } = this.props;

    return (
      <Layout
        title="Alerts"
        appColor="dark"
      >
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
          flexDirection="column"
          testID={testID}
        >
          <Text>
Alerts
          </Text>

          <Input
            type="text"
            icon="edit"
          />
        </Box>
      </Layout>
    );
  }
}

export default Alerts;
