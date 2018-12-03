import { prefixedLog, isArray } from '../../utils';
import { store } from '../../redux';
import * as events from './events';

class MessageHandler {
  constructor() {
    this.log = prefixedLog( 'MessageHandler' );
    this.lastBe = new Date().getTime();
    this.beBatch = [];

    setInterval( this.checkMessageBatch, 200 );
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

  checkMessageBatch = () => {
    if (
      this.beBatch.length > 0 &&
      new Date().getTime() - this.lastBe > 200
    ) {
      this.drainMessageBatch();
    }
  }

  drainMessageBatch = () => {
    const message = this.beBatch.reduce( this.handleReduceMessageBatch, this.beBatch[0] );

    store.dispatch( message );

    this.beBatch = [];
  }

  handleReduceMessageBatch = ( output, current ) => {
    /**
     * If the message has an aliasCode process it individually.
     * Additionally don't apply this to aliasCodes that match
     * the parentCode as this eliminates a large number of
     * individual messages, increasing performance.
     */
    if ( current.payload.aliasCode && current.payload.aliasCode !== current.payload.parentCode ) {
      store.dispatch( current );

      return output;
    }

    output.payload.items = [
      ...output.payload.items,
      ...current.payload.items.map( item => ({
        delete: current.payload.delete,
        replace: current.payload.replace,
        shouldDeleteLinkedBaseEntities: current.payload.shouldDeleteLinkedBaseEntities,
        parentCode: current.payload.parentCode,
        ...item,
      })),
    ];

    return output;
  }

  onMessage = message => {
    if ( !message ) return;

    const { msg_type, data_type, messages } = message;
    const isValidMessage = this.validMessageTypes.includes( msg_type );

    if (
      !isValidMessage &&
      data_type !== 'QBulkMessage'
    ) {
      this.log(
        `Ignoring message of type ${msg_type}. Must be one of the following: ${this.validMessageTypes.join( '|' )}`,
        'warn'
      );

      return;
    }

    if (
      data_type === 'QBulkMessage' &&
      isArray( messages, { ofMinLength: 1 })
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

    if ( message.data_type === 'BaseEntity' && !message.delete && !message.replace ) {
      /* Add to a batch */
      this.beBatch.push(
        action( message )
      );

      this.lastBe = new Date().getTime();
    } 
    else {
      const payload = message;

      if ( isArray( payload.items )) {
        payload.items = payload.items.map( item => ({
          shouldDeleteLinkedBaseEntities: payload.shouldDeleteLinkedBaseEntities,
          parentCode: payload.parentCode,
          delete: payload.delete,
          replace: payload.replace,
          ...item,
        }));
      }

      store.dispatch(
        action( payload )
      );
    }
  }
}

export default MessageHandler;
