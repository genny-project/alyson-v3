import React from 'react';
import { any } from 'prop-types';
import Layout from '../../../layout';
import { Box, Text, Button, Heading } from '../../../components';
import { store } from '../../../../redux';
import { fetchKeycloakConfig } from '../../../../redux/actions';

const handleRetry = () => {
  store.dispatch(
    fetchKeycloakConfig()
  );
};

const AuthenticatedAppError = ({ error }) => ( // eslint-disable-line no-unused-vars
  <Layout
    title="Uh oh!"
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
      <Box marginBottom={20}>
        <Heading align="center">
          Failed to load the page!
        </Heading>
      </Box>

      <Text align="center">
        {error}
      </Text>

      <Box
        marginTop={20}
        padding={20}
      >
        <Button
          color="green"
          size="md"
          onPress={handleRetry}
        >
          Retry
        </Button>
      </Box>
    </Box>
  </Layout>
);

AuthenticatedAppError.propTypes = {
  error: any,
};

export default AuthenticatedAppError;
