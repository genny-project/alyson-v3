import React, { Component } from 'react';
import { Text, Box } from '../../components';
import Layout from '../../layout';

class Profile extends Component {
  render() {
    return (
      <Layout
        title="Profile"
        appColor="dark"
      >
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
        >
          <Text>
Profile
          </Text>
        </Box>
      </Layout>
    );
  }
}

export default Profile;
