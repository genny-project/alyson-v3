import React, { Component } from 'react';
import { Text, Box } from '../../components';
import Layout from '../../layout';

class Alerts extends Component {
  render() {
    return (
      <Layout title="Alerts">
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
        >
          <Text>Alerts</Text>
        </Box>
      </Layout>
    );
  }
}

export default Alerts;
