/* eslint-disable new-cap */
import { prefixedLog } from '../../utils';
import { store } from '../../redux';
import * as events from './events';

class MessageHandler {
  constructor() {
    this.log = prefixedLog( 'MessageHandler' );
  }

  validMessageTypes = [
    'DATA_MSG',
    'CMD_MSG',
    'EVT_MSG',
  ]

  eventTypes = {
    DATA_MSG: 'data_type',
    CMD_MSG: 'cmd_type',
    EVT_MSG: 'event_type',
  }

  onMessage = message => {
    if ( !message ) return;

    const { msg_type, data_type, messages } = message;
    const isValidMessage = this.validMessageTypes.includes( msg_type );

    if ( !isValidMessage ) {
      this.log(
        `Ignoring message of type ${msg_type}. Must be one of the following: ${this.validMessageTypes.join( '|' )}`,
        'warn'
      );
      return;
    }

    if (
      data_type === 'QDataBulkMessage' &&
      messages != null &&
      messages instanceof Array &&
      messages.length > 0
    ) {
      messages.forEach( this.onMessage );
      return;
    }

    const eventType = this.eventTypes[msg_type];
    const event = message[eventType];
    const action = events[event];

    if ( !action ) {
      this.log(
        `Could not find action for type of '${eventType}'! (derived from message type '${msg_type}')`,
        'warn'
      );

      return;
    }

    store.dispatch(
      action( message )
    );
  }
}

export default MessageHandler;
