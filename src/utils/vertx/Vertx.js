import EventBus from 'vertx3-eventbus-client';
import decodeToken from 'jwt-decode';
import NProgress from 'nprogress';
// import pako from 'pako';
import { prefixedLog } from '../../utils';
import { store } from '../../redux';
import * as actions from '../../redux/actions';

const { deepParseJson } = require( 'deep-parse-json' );

function convertDataURIToBinary( base64 ) {
  // var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  // var base64 = dataURI.substring(base64Index);
  var raw = window.atob( base64 );
  var rawLength = raw.length;
  var array = new Uint8Array( new ArrayBuffer( rawLength ));

  for ( var i = 0; i < rawLength; i++ ) {
    array[i] = raw.charCodeAt( i );
  }

  return array;
}

const ZstdCodec = require( 'zstd-codec' ).ZstdCodec;

class Vertx {
  constructor() {
    this.log = prefixedLog( 'Vertx' );
  }

  constants = {
    RECONNECT_TIMEOUT: 1500,
  };

  state = {
    connected: false,
    url: null,
    token: null,
    eventBus: null,
    reconnectTimeout: null,
    messageQueue: [],
  };

  setState = state => {
    this.state = {
      ...this.state,
      ...( typeof state === 'function' ? state( this.state ) : state ),
    };
  };

  init( url, token ) {
    this.setState({ token, url });

    this.log( 'Initiating...' );

    this.openEventBus( url );
  }

  openEventBus( url ) {
    const eventBus = new EventBus( url );

    this.log( 'Connecting to event bus...' );

    this.setState({ eventBus });

    eventBus.onopen = this.handleEventBusOpen;
    eventBus.onclose = this.handleEventBusClose;
  }

  handleEventBusOpen = () => {
    this.setState({ connected: true });

    this.log( 'Connected!' );

    if ( this.state.reconnectTimeout ) clearTimeout( this.state.reconnectTimeout );

    const sessionData = decodeToken( this.state.token );

    if ( sessionData && sessionData.session_state ) {
      const { session_state } = sessionData;
      const { eventBus } = this.state;

      eventBus.registerHandler( session_state, this.handleRegisterHandler );

      store.dispatch( actions.initVertxSuccess());

      this.sendQueuedMessages();
    }
  };

  uncompress = async (incomingCompressedMessage, callback) => {

     ZstdCodec.run( zstd => {
      const simple = new zstd.Simple();

      // const testB64EncodedStr = "KLUv/SAIQQAAYUdWc2JHOD0=";
      // console.warn({ incomingCompressedMessage });

      const incomingByteArray = convertDataURIToBinary( incomingCompressedMessage );

      //  console.warn({ incomingByteArray });

      const decompressedDataArray = simple.decompress( incomingByteArray );

      // console.warn({ decompressedDataArray });

      var decompressedStr = new TextDecoder( 'utf-8' ).decode( decompressedDataArray );

      //  console.warn({ decompressedStr });

      var decoded = window.atob( decompressedStr );

      const jsonified = JSON.parse( decoded );
      deeplyParsed = deepParseJson( decoded );

      callback(deeplyParsed);

      // console.warn(decoded);
    });
  };

  handleRegisterHandler = async ( error, message ) => {
    if ( message && message.body && message.body.zip ) {
        this.uncompress( message.body.zip, data => {
      this.handleIncomingMessage( data );
      });
      
    } else if ( message ) this.handleIncomingMessage( message.body );

    if ( error ) this.log( error, 'error' );
  };

  handleIncomingMessage = message => {
    const { incomingMessageHandler } = this.state;

    if ( message && message.cmd_type && message.cmd_type === 'ROUTE_CHANGE' ) {
      NProgress.done();
    }

    // this.log( 'Receiving a message' );

    if ( incomingMessageHandler ) incomingMessageHandler( message );
  };

  handleEventBusClose = () => {
    const { reconnectTimeout } = this.state;
    const { RECONNECT_TIMEOUT } = this.constants;

    this.log( 'Closed connection.', 'warn' );

    if ( reconnectTimeout ) clearInterval( reconnectTimeout );

    this.setState({
      connected: false,
      reconnectTimeout: setTimeout( this.attemptReconnect, RECONNECT_TIMEOUT ),
    });
  };

  setIncomingMessageHandler( handler ) {
    this.setState({
      incomingMessageHandler: handler,
    });
  }

  attemptReconnect = () => {
    const { url, token } = this.state;

    this.init( url, token );
  };

  pushToMessageQueue( message ) {
    this.setState( state => ({
      messageQueue: [...state.messageQueue, message],
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

  sendMessage( message ) {
    const { connected, eventBus } = this.state;

    this.log( 'Sending a message...' );

    if ( !connected ) {
      this.log( 'Message not sent, not connected to Vertx.', 'warn' );

      this.pushToMessageQueue( message );
    } else {
      this.log( 'Message sent.' );

      eventBus.send( 'address.inbound', {
        data: message,
      });
    }
  }
}

export default new Vertx();
