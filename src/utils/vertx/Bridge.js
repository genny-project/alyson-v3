/* eslint-disable new-cap */
import axios from 'axios';
import config from '../../config';
import Vertx from './Vertx';
import MessageHandler from './MessageHandler';
import * as events from './events';

class Bridge {
  constructor() {
    this.messageHandler = new MessageHandler();
  }

  initVertx( url, token ) {
    this.log( 'Opening Vertx...' );

    Vertx.setIncomingMessageHandler(
      this.messageHandler.onMessage
    );

    Vertx.init( url, token );
  }

  log( message, level = 'info' ) {
    if ( level === 'info' )
      console.info( `[Bridge] ${message}` );

    else if ( level === 'error' )
      console.error( `[Bridge] ${message}` );

    else if ( level === 'warning' )
      console.warn( `[Bridge] ${message}` );

    else
      console.log( `[Bridge] ${message}` ); // eslint-disable-line no-console
  }

  sendAuthInit( token ) {
    this.log( 'Sending auth init...' );

    axios.post( `${config.genny.host}/${config.genny.bridge.endpoints.events}/init?url=${window.location.origin}&hi`, {
      method: 'POST',
      responseType: 'json',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    Vertx.sendMessage(
      events.AUTH_INIT( token )
    );
  }
}

export default new Bridge();
