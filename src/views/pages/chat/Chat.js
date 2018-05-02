import React, { Component } from 'react';
import { Text, Box } from '../../components';
import Layout from '../../layout';

class Chat extends Component {
  render() {
    return (
      <Layout
        title="Chat"
        appColor="dark"
      >
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
        >
          <Text>Chat</Text>
        </Box>
      </Layout>
    );
  }
}

export default Chat;
