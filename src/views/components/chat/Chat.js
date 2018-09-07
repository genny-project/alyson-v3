import React, { Component, Fragment } from 'react';
import { any, array, string, object } from 'prop-types';
import { GiftedChat, MessageText, Bubble, Send } from 'react-native-gifted-chat';

import { Icon, Box, Text, BackButton }  from '../../components';

class Chat extends Component {
  static defaultProps = {
    bubbleRightColor: 'red',
    user: {
      _id: 1,
    },
    users: [],
  };

  static propTypes = {
    children: any,
    tabs: array,
    bubbleRightColor: string,
    sendIcon: string,
    sendIconColor: string,
    sendIconBackgroundColor: string,
    user: object,
    users: array,
  };

  state = {
    messages: [
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ],
  };

  onSend = ( messages = [] ) => {
    this.setState( previousState => ({
      messages: GiftedChat.append( previousState.messages, messages ),
    }));
  }

  renderParticipants = () => {
    const { users } = this.props;

    return users
      .filter( user => user.code !== this.props.user._id )
      .map( user => user.name ).join( ', ' );
  }

  renderMessage = props => {
    return <MessageText {...props} />;
  }

  renderSend = props => {
    const {
      sendIcon,
      sendIconColor,
      sendIconBackgroundColor,
    } = this.props;

    if ( sendIcon ) {
      return (
        <Send
          {...props}
        >
          <Box
            width={50}
            alignItems="center"
            justifyContent="center"
            backgroundColor={sendIconBackgroundColor}
            height="100%"
          >
            <Icon
              color={sendIconColor}
              name={sendIcon}
            />
          </Box>
        </Send>
      );
    }

    return (
      <Send
        {...props}
      />
    );
  }

  renderBubble = props => {
    const {
      bubbleRightColor,
    } = this.props;

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: bubbleRightColor,
          },
        }}
      />
    );
  }

  render() {
    const { user } = this.props;

    console.warn( this.props );

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
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend( messages )}
          renderBubble={this.renderBubble}
          renderSend={this.renderSend}
          user={user}
        />
      </Fragment>
    );
  }
}

export default Chat;
