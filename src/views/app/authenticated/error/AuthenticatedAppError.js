import React from 'react';
import { any } from 'prop-types';
import Layout from '../../../layout';
import { Box, Text } from '../../../components';

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
      {/* TODO: improve the error message */}
      <Text>Damn! Something's shat itself.</Text>
    </Box>
  </Layout>
);

AuthenticatedAppError.propTypes = {
  error: any,
};

export default AuthenticatedAppError;
