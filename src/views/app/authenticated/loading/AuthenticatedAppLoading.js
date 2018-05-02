import React from 'react';
import { ActivityIndicator } from 'react-native';
import Layout from '../../../layout';
import { Box, Text } from '../../../components';

const AuthenticatedAppError = () => ( // eslint-disable-line no-unused-vars
  <Layout
    title="Loading..."
    appColor="light"
    hideHeader
    hideSidebar
  >
    <Box
      justifyContent="center"
      alignItems="center"
      flex={1}
      flexDirection="column"
    >
      <ActivityIndicator />

      <Text>Loading authentication...</Text>
    </Box>
  </Layout>
);

export default AuthenticatedAppError;
