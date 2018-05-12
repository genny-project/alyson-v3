import React, { Component } from 'react';
import { Text, Box, Input } from '../../components';
import Layout from '../../layout';

class Commons extends Component {
  render() {
    return (
      <Layout
        title="Commons"
        appColor="dark"
      >
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
          flexDirection="column"
        >
          <Text>
Commons
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

export default Commons;
