/* eslint-disable new-cap */
import { prefixedLog } from '../../utils';
import { store } from '../../redux';
import * as events from './events';

class MessageHandler {
  constructor() {
    this.log = prefixedLog( 'MessageHandler' );
    this.lastBe = new Date().getTime();
    this.beBatch = [];

    setInterval(() => {
      if ( new Date().getTime() - this.lastBe > 200 && this.beBatch.length ) {
        /* Get the template */
        const message = this.beBatch.reduce(( output, current ) => {
          return {
            ...output,
            payload: {
              ...output.payload,
              items: [...output.payload.items, ...current.payload.items],
            },
          };
        }, this.beBatch[0] );

        store.dispatch( message );
        // this.beBatch.forEach( message => {
        //   store.dispatch( message );
        // });
        this.beBatch = [];
      }
    }, 200 );
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

    if ( message.data_type === 'BaseEntity' && !message.delete ) {
      /* Add to a batch */
      this.beBatch.push( action( message ));
      this.lastBe = new Date().getTime();
    } else {
      store.dispatch( action( message ));
    }
  }
}

export default MessageHandler;
