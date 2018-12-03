import React, { Component } from 'react';
import { Text, Box } from '../../components';
import Layout from '../../layout';

class Settings extends Component {
  render() {
    return (
      <Layout
        title="Settings"
        appColor="dark"
      >
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
          flexDirection="column"
          testID="page-settings"
        >
          <Text>
Settings
          </Text>
        </Box>
      </Layout>
    );
  }
}

export default Settings;
