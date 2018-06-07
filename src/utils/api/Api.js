import 'rxjs/add/observable/dom/ajax';
import { Observable } from 'rxjs/Observable';
import axios from 'axios';
import queryString from 'query-string';
import config from '../../config';

class Api {
  observableCall = ( options = {}) => {
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

  promiseCall = ( options = {}) => {
    return axios({
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
    return this.observableCall({
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

  googleMapsCall = ( options = {}) => {
    const queryPrefix = (
      options.url &&
      options.url.includes( '?' )
    )
      ? '&'
      : '?';

    const key = 'AIzaSyC5HjeRqeoqbxHEQWieE0g9hLaN6snjorA'; // TODO: remove hardcode

    return this.promiseCall({
      ...options,
      url: `https://maps.googleapis.com/maps/api/${options.url}${queryPrefix}key=${key}`,
    });
  }

  getPlaceAutocomplete = ( options = {}) => {
    const query = queryString.stringify({
      input: options.address,
    });

    return this.googleMapsCall({
      method: 'get',
      url: `place/autocomplete/json?${query}`,
    });
  }

  getGeocodedAddress = ( options = {}) => {
    const query = queryString.stringify({
      address: options.address,
    });

    return this.googleMapsCall({
      method: 'get',
      url: `geocode/json?${query}`,
    });
  }

  getKeycloakConfig = () => {
    return this.eventCall({
      url: `init?url=${config.genny.initUrl}`,
    });
  }
}

export default new Api();
