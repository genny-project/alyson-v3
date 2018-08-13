import React, { Component } from 'react';
import { any, number, func } from 'prop-types';
import Layout from '../../../layout';
import { Box, Text, Button, Heading } from '../../../components';
import { store } from '../../../../redux';
import { fetchKeycloakConfig } from '../../../../redux/actions';

class AuthenticatedAppError extends Component {
  static propTypes = {
    error: any,
    secondsUntilRetry: number,
    onMount: func,
  }

  componentDidMount() {
    if ( this.props.onMount )
      this.props.onMount();
  }

  handleRetry = () => {
    store.dispatch(
      fetchKeycloakConfig()
    );
  }

  render() {
    const { error, secondsUntilRetry } = this.props;

    return (
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
            {error || 'Unknown error'}
          </Text>

          <Box
            marginTop={20}
            padding={20}
          >
            <Button
              color="green"
              size="md"
              onPress={this.handleRetry}
            >
              Retry
            </Button>
          </Box>

          {secondsUntilRetry ? (
            <Box>
              <Text
                color="grey"
                size="xs"
              >
                Retrying in
                {' '}
                {secondsUntilRetry}
                {' '}
                second
                {secondsUntilRetry !== 1 ? 's' : ''}
                ...
              </Text>
            </Box>
          ) : null}
        </Box>
      </Layout>
    );
  }
}

export default AuthenticatedAppError;
