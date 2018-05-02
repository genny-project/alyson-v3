import React, { Component } from 'react';
import { Text, Box } from '../../components';
import Layout from '../../layout';

class Settings extends Component {
  render() {
    return (
      <Layout
        title="Settings"
      >
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
          flexDirection="column"
        >
          <Text>Settings</Text>
        </Box>
      </Layout>
    );
  }
}

export default Settings;
