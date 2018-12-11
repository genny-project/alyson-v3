import React, { Component, Fragment } from 'react';
import { string } from 'prop-types';
import {  Box, Text, BackButton }  from '../../components';

class Chat extends Component {
  static defaultProps = {
    testID: 'chat',
  };

  static propTypes = {
    user: string,
    testID: string,
  };

  renderParticipants = () => {
    const { users } = this.state;

    // eslint-disable-next-line no-console
    console.warn({ users });

    return users
      .filter( user => user.code !== this.props.user._id )
      .map( user => user.name ).join( ', ' );
  }

  render() {
    const { testID } = this.props;

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
            testID={testID}
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
