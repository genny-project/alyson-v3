/* eslint-disable new-cap */
import axios from 'axios';
import config from '../../config';
import { prefixedLog } from '../../utils';
import Vertx from './Vertx';
import MessageHandler from './MessageHandler';
import * as events from './events';

class Bridge {
  constructor() {
    this.messageHandler = new MessageHandler();

    this.log = prefixedLog( 'Bridge' );
  }

  initVertx( url, token ) {
    this.log( 'Opening Vertx...' );

    Vertx.setIncomingMessageHandler(
      this.messageHandler.onMessage
    );

    Vertx.init( url, token );
  }

  sendAuthInit( token ) {
    this.log( 'Sending auth init...' );

    const origin = window.location ? window.location.origin : 'http://localhost:3000';

    axios.post( `${config.genny.host}/${config.genny.bridge.endpoints.events}/init?url=${origin}`, {
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
