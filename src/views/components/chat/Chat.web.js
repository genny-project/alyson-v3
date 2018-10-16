import React, { Component, Fragment } from 'react';
import { string } from 'prop-types';
import {  Box, Text, BackButton }  from '../../components';

class Chat extends Component {
  static defaultProps = {
  };

  static propTypes = {
    user: string,
  };

  renderParticipants = () => {
    const { users } = this.state;

    console.warn({ users });

    return users
      .filter( user => user.code !== this.props.user._id )
      .map( user => user.name ).join( ', ' );
  }

  render() {
    return (
      <Fragment>
        <Box>
          <Box
            flex={1}
          >
            <BackButton />
          </Box>
          <Box
            flex={4}
            justifyContent="center"
            alignItems="center"
            testID="chat"
          >
            <Text>
              {
                this.renderParticipants()
              }
            </Text>
          </Box>
          <Box
            flex={1}
          />

        </Box>
      </Fragment>
    );
  }
}

export default Chat;
