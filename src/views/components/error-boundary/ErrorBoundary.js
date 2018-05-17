import React, { Component } from 'react';
import { node } from 'prop-types';
import Layout from '../../layout';
import { Box, Text, Heading } from '../index';

class ErrorBoundary extends Component {
  static propTypes = {
    children: node,
  }

  state = {
    error: null,
  }

  componentDidCatch( error ) {
    this.setState({ error });
  }

  render() {
    const { children } = this.props;
    const { error } = this.state;

    if ( error ) {
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
            height="100%"
          >
            <Heading>
              An error has occurred!
            </Heading>

            <Text>
              {error.toString()}
            </Text>
          </Box>
        </Layout>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
