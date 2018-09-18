import React, { Component, Fragment } from 'react';
import { any, array, string, object } from 'prop-types';
import { GiftedChat, MessageText, Bubble, Send } from 'react-native-gifted-chat';
import moment from 'moment';

import { Bridge } from '../../../utils';
import { Icon, Box, Text, BackButton }  from '../../components';

class Chat extends Component {
  static defaultProps = {
    bubbleRightColor: 'red',
    user: {
      _id: 1,
    },
    chatLinks: [],
  };

  static propTypes = {
    children: any,
    tabs: array,
    bubbleRightColor: string,
    sendIcon: string,
    sendIconColor: string,
    sendIconBackgroundColor: string,
    user: object,
    chatLinks: array,
    itemCode: string,
  };

  state = {
    messages: [],
    users: [],
  };

  static getDerivedStateFromProps( props, state ) {
    const { chatLinks } = props;

    console.warn({
      state, props, chatLinks,
    });

    const newState = chatLinks.reduce(
      ( acc, curr ) => {
        if ( curr.name === 'message' )  {
          const { PRI_MESSAGE, PRI_CREATOR } = curr.attributes;

          const newMessage = {
            _id: PRI_MESSAGE.baseEntityCode,
            text: PRI_MESSAGE.value,
            createdAt: moment( `${PRI_MESSAGE.created}Z` ),
            user: {
              _id: PRI_CREATOR.value,
            },
          };

          return {
            ...acc,
            messages: [
              ...acc.messages, newMessage,
            ],
          };
        }

        // if it's not a message, it's a user

        return {
          ...acc,
          users: [
            ...acc.users, curr,
          ],
        };
      }, {
        users: [],
        messages: [],
      });

    newState.messages.sort(( messageA, messageB ) => messageB.createdAt.diff( messageA.createdAt ));

    return newState;
  }

  onSend = ( messages = [] ) => {
    const { itemCode, user } = this.props;

    messages.forEach( message => {
      Bridge.sendButtonEvent( 'BTN_CLICK', {
        code: 'BTN_SEND_MESSAGE',
        value: JSON.stringify({
          itemCode,
          userCode: user._id,
          message: message.text || null,
        }),
      });
    });

    this.setState( previousState => ({
      messages: GiftedChat.append( previousState.messages, messages ),
    }));
  }

  renderParticipants = () => {
    const { users } = this.state;

    console.warn({ users });

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