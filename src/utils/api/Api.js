import 'rxjs/add/observable/dom/ajax';
import { Observable } from 'rxjs/Observable';
import axios from 'axios';
import queryString from 'query-string';
import config from '../../config';
import store from '../../redux/store';
import { isObject } from '../../utils';

class Api {
  observableCall = ( options = {}) => {
    return Observable.ajax({
      timeout: 30000,
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
      timeout: 30000,
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

  googleMapsCall = async ( options = {}) => {
    const queryPrefix = (
      options.url &&
      options.url.includes( '?' )
    )
      ? '&'
      : '?';

    const { keycloak } = store.getState();

    const apiKey = (
      process.env.ENV_GOOGLE_MAPS_APIKEY ||
      ( keycloak.data && keycloak.data.ENV_GOOGLE_MAPS_APIKEY )
    );

    /* If we can't find an API key, use the below util to keep trying. */
    if ( !apiKey ) {
      try {
        let counter = 0;
        const MAX_ATTEMPTS = 20;

        /* Keep trying to find the Google API key through an interval loop. */
        await new Promise(( resolve, reject ) => {
          this.interval = setInterval(() => {
            const { data } = store.getState().keycloak;

            if ( isObject( data, { withProperty: 'ENV_GOOGLE_MAPS_APIKEY' })) {
              clearInterval( this.interval );
              resolve();
            }
            else if ( ++counter > MAX_ATTEMPTS ) {
              reject();
              clearInterval( this.interval );
            }
          }, 200 );
        });
      }
      /* If it doesn't happen within MAX_ATTEMPTS, stop trying. */
      catch ( error ) {
        // do nothing, let the network request fail so we can debug easier
      }
    }

    return this.promiseCall({
      ...options,
      url: `https://maps.googleapis.com/maps/api/${options.url}${queryPrefix}key=${apiKey}`,
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

  getGeocodedAddress = ( components ) => {
    const query = queryString.stringify( components );

    return this.googleMapsCall({
      method: 'get',
      url: `geocode/json?${query}`,
    });
  }

  getKeycloakConfig = () => {
    const initUrl = process.env.GENNY_INIT_URL || window.location.origin;

    return this.eventCall({
      url: `init?url=${initUrl}`,
    });
  }

  getPublicLayouts = () => {
    const { data } = store.getState().keycloak;

    const publicLayoutUrl = (
      process.env.ENV_LAYOUT_PUBLICURL ||
      ( data && data.ENV_LAYOUT_PUBLICURL ) ||
      'http://localhost:2224'
    );

    const directory = (
      process.env.ENV_LAYOUT_QUERY_DIRECTORY ||
      ( data && data.ENV_LAYOUT_QUERY_DIRECTORY )
    );

    if ( !directory ) {
      // eslint-disable-next-line no-console
      console.warn( `Unable to fetch public layouts from ${publicLayoutUrl} - no directory set. (process.env.ENV_LAYOUT_QUERY_DIRECTORY)` );

      throw new Error( `Unable to fetch public layouts from ${publicLayoutUrl} - no directory set. (process.env.ENV_LAYOUT_QUERY_DIRECTORY)` );
    }

    const query = queryString.stringify({ directory });

    return this.observableCall({
      url: `${publicLayoutUrl}/public?${query}`,
    });
  }
}

export default new Api();
