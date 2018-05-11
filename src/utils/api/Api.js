import 'rxjs/add/observable/dom/ajax';
import { Observable } from 'rxjs/Observable';
import config from '../../config';

class Api {
  call = ( options = {}) => {
    return Observable.ajax({
      timeout: 3000,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
  }

  gennyCall = ( options = {}) => {
    return this.call({
      ...options,
      url: `${config.genny.host}/${options.url}`,
    });
  }

  eventCall = options => {
    return this.gennyCall({
      ...options,
      url: `${config.genny.bridge.endpoints.events}/${options.url}`,
    });
  }

  getKeycloakConfig = () => {
    // const origin = process.env.NODE_ENV !== 'production'
    // ? 'http://localhost:3000'
    // : (
    //   process.env.FORCE_REACT_ORIGIN ||
    //   'http://localhost:3000' // FIXME: Hardcoded for native, originally was `window.location.origin`
    // );

    return this.eventCall({
      url: 'init?url=https://v2.channel40.com.au',
    });
  }
}

export default new Api();
