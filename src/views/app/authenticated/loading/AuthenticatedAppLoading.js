import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Box, Text } from '../../../components';

const AuthenticatedAppLoading = () => ( // eslint-disable-line no-unused-vars
  <Box
    justifyContent="center"
    alignItems="center"
    flex={1}
    flexDirection="column"
  >
    <ActivityIndicator size="large" />

    <Box height={20} />

    <Text align="center">
        Loading authentication...
    </Text>
  </Box>
);

export default AuthenticatedAppLoading;
