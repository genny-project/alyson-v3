import React from 'react';
import { any } from 'prop-types';
import Layout from '../../../layout';
import { Box, Text, Button } from '../../../components';
import { refresh } from '../../../../utils';

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
      <Text>
Failed to load the page!
      </Text>
      <Text>
Please refresh the page to try again.
      </Text>
      <Box  
        marginTop={20}
      >
        <Button
          color="green"
          size="md"
          onPress={refresh}
        >
          Refresh
        </Button>
      </Box>
    </Box>
  </Layout>
);

AuthenticatedAppError.propTypes = {
  error: any,
};

export default AuthenticatedAppError;
