import React, { Component } from 'react';
import { node } from 'prop-types';
import Layout from '../../layout';
import { Box, Text, Heading, ScrollView } from '../index';

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
          <ScrollView flex={1}>
            <Box
              justifyContent="center"
              alignItems="center"
              flex={1}
              flexDirection="column"
            >
              <Heading>
                An error has occurred!
              </Heading>

              <Box height={20} />

              <Text>
                {error.toString()}
              </Text>
            </Box>
          </ScrollView>
        </Layout>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
