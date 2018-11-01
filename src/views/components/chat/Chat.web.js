import React, { Component, Fragment } from 'react';
import { object } from 'prop-types';
import {  Box, Text, BackButton }  from '../../components';

class Chat extends Component {
  static defaultProps = {
    user: {},
  };

  static propTypes = {
    user: object,
  };

  renderParticipants = () => {
    const { users } = this.state;

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
