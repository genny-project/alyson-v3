import React, { Component } from 'react';
import { Text, Box, Input } from '../../components';
import Layout from '../../layout';

class Alerts extends Component {
  render() {
    return (
      <Layout title="Alerts">
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
          flexDirection="column"
        >
          <Text>Alerts</Text>

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
