/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { node, string } from 'prop-types';
import queryString from 'query-string';
import config from '../../../../config';
import GoogleContext from '../context';

class GoogleProvider extends Component {
  static defaultProps = {
    initCallbackName: '__googleProvider_initCallback__',
    scriptTagId: '__script__google-maps',
  }

  static propTypes = {
    children: node,
    initCallbackName: string,
    scriptTagId: string,
  }

  /* eslint-disable react/sort-comp */

  autocompleteAddress = ( address, options = {}) => {
    const { autocompleter, autocompleteOK } = this.state;

    return new Promise(( resolve, reject ) => {
      if ( !autocompleter ) {
        return reject(
          new Error( 'Unable to autocomplete - Google Places has not been initialized. Please call `initGeocoder()` from `GoogleConsumer`.' )
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

  injectGoogleMapsScript() {
    const { scriptTagId } = this.props;
    const isAlreadyInjected = !!document.getElementById( scriptTagId );

    if ( isAlreadyInjected )
      throw new Error( 'Attempted to inject Google Maps script when the script has already been injected.' );

    const apiKey = 'AIzaSyC5HjeRqeoqbxHEQWieE0g9hLaN6snjorA'; // TODO: remove hardcode

    const { initCallbackName } = this.props;
    const { apiUrl } = config.google.maps;
    const scriptTag = document.createElement( 'script' );

    const apiUrlQuery = queryString.stringify({
      key: apiKey,
      libraries: 'places',
      callback: initCallbackName,
    });

    scriptTag.src = `${apiUrl}?${apiUrlQuery}`;
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

export default GoogleProvider;
