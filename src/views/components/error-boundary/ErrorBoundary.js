import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { node } from 'prop-types';
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
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            flex={1}
            padding={20}
          >
            <Box
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
        </SafeAreaView>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
