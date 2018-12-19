/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { node, string, object } from 'prop-types';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { isObject } from '../../../../utils';
import GoogleContext from '../context';

const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/js';

class GoogleProvider extends Component {
  static defaultProps = {
    initCallbackName: '__googleProvider_initCallback__',
    scriptTagId: '__script__google-maps',
  }

  static propTypes = {
    children: node,
    initCallbackName: string,
    scriptTagId: string,
    keycloak: object,
  }

  /* eslint-disable react/sort-comp */

  autocompleteAddress = ( address, options = {}) => {
    const { autocompleter, autocompleteOK } = this.state;

    return new Promise(( resolve, reject ) => {
      if ( !autocompleter ) {
        return reject(
          new Error( 'Unable to autocomplete - Google Places has not been initialized. Please call `init()` from `GoogleConsumer`.' )
        );
      }

      autocompleter.getPlacePredictions({
        ...options,
        input: address,
      }, ( results, status ) => {
        if ( status === autocompleteOK )
          return resolve( results );

        reject(
          new Error( `Geocode was not successful. Reason: ${status}` )
        );
      });
    });
  }

  geocodeAddress = ( location, options = {}) => {
    const {} = options; // eslint-disable-line
    const { geocoder, geocodeOK } = this.state;

    return new Promise(( resolve, reject ) => {
      if ( !geocoder ) {
        return reject(
          new Error( 'Unable to geocode - Google geocoder has not been initialized. Please call `initMaps()` from `GoogleConsumer`.' )
        );
      }

      geocoder.geocode( location, ( results, status ) => {
        if ( status === geocodeOK )
          return resolve( results );

        reject(
          new Error( `Geocode was not successful. Reason: ${status}` )
        );
      });
    });
  }

  /* eslint-enable react/sort-comp */

  state = {
    geocoder: null,
    autocompleter: null,
    geocodeOK: '',
    autocompleteOK: '',
    geocodeAddress: this.geocodeAddress,
    autocompleteAddress: this.autocompleteAddress,
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    const { initCallbackName } = this.props;

    /* Make sure our init callback function has been cleaned up. */
    if ( window[initCallbackName] != null )
      delete window[initCallbackName];
  }

  init = () => {
    const { initCallbackName } = this.props;

    /**
     * If Google has not loaded in the window yet,
     * we need to inject the Google script tag into
     * the document body. This script tag will attempt
     * to invoke a callback once complete, so we must
     * make sure our callback function is defined before
     * injecting the Google script tag.
     *
     * Otherwise if `window.google` exists, Google has
     * successfully loaded into our document and we can
     * invoke our success function.
     */
    if ( window.google == null ) {
      if ( window[initCallbackName] == null )
        window[initCallbackName] = this.init;

      this.injectGoogleScripts();
    }
    else {
      this.initSuccess();
    }
  }

  initSuccess = () => {
    const { initCallbackName } = this.props;

    /* Clean up our callback function. */
    delete window[initCallbackName];

    /* Create our Google service instances. */
    const geocoder = new window.google.maps.Geocoder();
    const autocompleter = new window.google.maps.places.AutocompleteService();

    this.setState({
      geocoder,
      geocodeOK: window.google.maps.GeocoderStatus.OK,
      autocompleter,
      autocompleteOK: window.google.maps.places.PlacesServiceStatus.OK,
    });
  }

  injectGoogleScripts() {
    this.injectGoogleMapsScript();
  }

  async injectGoogleMapsScript() {
    const { scriptTagId } = this.props;
    const isAlreadyInjected = !!document.getElementById( scriptTagId );

    if ( isAlreadyInjected )
      throw new Error( 'Attempted to inject Google Maps script when the script has already been injected.' );

    const { initCallbackName, keycloak } = this.props;
    const scriptTag = document.createElement( 'script' );

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
            const { data } = this.props.keycloak;

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
      /* If it doesn't happen within MAX_ATTEMPTS, break out of the function. */
      catch ( error ) {
        // eslint-disable-next-line no-console
        console.warn( 'Unable to inject Google Maps script into webpage - no given Google API key. (keycloak.data.ENV_GOOGLE_MAPS_APIKEY)' );

        return;
      }
    }

    const apiUrlQuery = queryString.stringify({
      key: apiKey,
      libraries: 'places',
      callback: initCallbackName,
    });

    scriptTag.src = `${GOOGLE_MAPS_API_URL}?${apiUrlQuery}`;
    scriptTag.async = true;
    scriptTag.id = scriptTagId;

    document.body.appendChild( scriptTag );
  }

  render() {
    return (
      <GoogleContext.Provider value={this.state}>
        {this.props.children}
      </GoogleContext.Provider>
    );
  }
}

export { GoogleProvider };

const mapStateToProps = state => ({
  keycloak: state.keycloak,
});

export default connect( mapStateToProps )( GoogleProvider );
