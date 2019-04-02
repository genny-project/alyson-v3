import EventBus from 'vertx3-eventbus-client';
import decodeToken from 'jwt-decode';
import NProgress from 'nprogress';
// import pako from 'pako';
import { prefixedLog } from '../../utils';
import { store } from '../../redux';
import * as actions from '../../redux/actions';

function stringToUint( string ) {
  var string = btoa( unescape( encodeURIComponent( string )));

  var charList = string.split( '' );

  var uintArray = [];

  for ( var i = 0; i < charList.length; i++ ) {
    uintArray.push( charList[i].charCodeAt( 0 ));
  }

  return new Uint8Array( uintArray );
}

function uintToString( uintArray ) {
  var encodedString = String.fromCharCode.apply( null, uintArray );

  var decodedString = decodeURIComponent( escape( atob( encodedString )));

  return decodedString;
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

  uncompress = async incomingCompressedMessage => {
    // return ZstdCodec.run( zstd => {
    //   console.warn( ' THis zstd run function is being trigerred' );
    //   const simple = new zstd.Simple();
    //   // convert base64 to normal string
    //   const base64toString = atob( incomingCompressedMessage );
    //   console.warn({ base64toString });
    //   // convert the normal string to byte array / array buffer
    //   const stringTOUnit = ab2str( base64toString );
    //   console.warn({ stringTOUnit });
    //   // decompress the string
    //   const decompressedData = simple.decompress( incomingCompressedMessage );
    //   console.warn({ decompressedData });
    //   return decompressedData;
    // });
    return ZstdCodec.run( zstd => {
      // console.warn( ' THis zstd run function is being trigerred' );
      // const unit = stringToUint( 'hello' );
      // console.warn({ unit });
      // const simple = new zstd.Simple();
      // const compressedData = simple.compress( unit );
      // console.warn({ compressedData });
      // const decompressedData = simple.decompress( compressedData );
      // console.warn({ decompressedData });
      // const units = uintToString( decompressedData );
      // console.warn({ units });

      console.warn({ incomingCompressedMessage });
      const simple = new zstd.Simple();

      const stringRep = window.atob( incomingCompressedMessage );

      console.warn({ stringRep });

      const uintFromString = stringToUint( stringRep );

      console.warn({ uintFromString });

      const decompressedData = simple.decompress( uintFromString );

      console.warn({ decompressedData });

      return decompressedData;
    });
  };

  handleRegisterHandler = async ( error, message ) => {
    if ( message && message.body && message.body.zip ) {
      const uncompressed = await this.uncompress( message.body.zip );

      this.handleIncomingMessage( uncompressed );
    } else if ( message ) this.handleIncomingMessage( message.body );

    if ( error ) this.log( error, 'error' );
  };

  handleIncomingMessage = message => {
    const { incomingMessageHandler } = this.state;

    if ( message.cmd_type && message.cmd_type === 'ROUTE_CHANGE' ) {
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
