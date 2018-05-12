/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { node } from 'prop-types';
import EventBus from 'vertx3-eventbus-client';
import decodeToken from 'jwt-decode';
import VertxContext from '../context';

class VertxProvider extends Component {
  static propTypes = {
    children: node,
  }

  /* eslint-disable react/sort-comp */

  init( url, token ) {
    this.setState({ token, url });

    this.openEventBus( url );
  }

  sendMessage( message ) {
    const { connected, eventBus } = this.state;

    if ( !connected )
      this.pushToMessageQueue( message );
    else {
      this.log( 'Sending a message' );

      eventBus.send( 'address.inbound', {
        data: message,
      });
    }
  }

  attemptReconnect = ( url, token ) => {
    this.init(
      url || this.state.url,
      token || this.state.token,
    );
  }

  state = {
    eventBus: null,
    token: null,
    url: null,
    init: this.init,
    sendMessage: this.sendMessage,
    attemptReconnect: this.attemptReconnect,
    messageQueue: [],
    reconnectTimer: null,
  }

  openEventBus( url ) {
    const eventBus = new EventBus( url );

    this.setState({ eventBus });

    this.eventBus.onopen( this.handleEventBusOpen );
    this.eventBus.onclose( this.handleEventBusClose );
  }

  handleEventBusOpen = () => {
    this.setState({ connected: true });

    if ( this.state.reconnectTimeout )
      clearTimeout( this.state.reconnectTimeout );

    const sessionDate = decodeToken( this.state.token );

    if (
      sessionDate &&
      sessionDate.session_state
    ) {
      const { session_state } = sessionDate;
      const { eventBus } = this.state;

      eventBus.registerHandler( session_state, this.handleRegisterHandler );

      this.sendQueuedMessages();
    }
  }

  handleRegisterHandler = ( error, message ) => {
    if ( message )
      this.handleIncomingMessage( message.body );

    if ( error )
      this.log( error, 'error' );
  }

  handleIncomingMessage = message => {
    const { incomingMessageHandler } = this.state;

    // this.log( 'Receiving a message' );

    if ( incomingMessageHandler )
      incomingMessageHandler( message );
  }

  handleEventBusClose = () => {
    const { reconnectTimeout } = this.state;
    const { RECONNECT_TIMEOUT } = this.constants;

    if ( reconnectTimeout )
      clearInterval( reconnectTimeout );

    this.setState({
      connected: false,
      reconnectTimeout: setTimeout( this.attemptReconnect, RECONNECT_TIMEOUT ),
    });
  }

  setIncomingMessageHandler( handler ) {
    this.setState({
      incomingMessageHandler: handler,
    });
  }

  pushToMessageQueue( message ) {
    this.setState( state => ({
      messageQueue: [
        ...state.messageQueue,
        message,
      ],
    }));
  }

  popMessageQueue() {
    this.setState( state => ({
      messageQueue: state.messageQueue.slice( 1 ),
    }));
  }

  sendQueuedMessages() {
    const { messageQueue } = this.state;

    if ( messageQueue.length === 0 ) return;

    messageQueue.forEach( message => {
      this.sendMessage( message );

      this.popMessageQueue();
    });
  }

  render() {
    return (
      <VertxContext.Provider value={this.state}>
        {this.props.children}
      </VertxContext.Provider>
    );
  }
}

export default VertxProvider;
