import React, { Component } from 'react';
import { node } from 'prop-types';
import config from '../../../../config';
import GoogleContext from '../context';

class GoogleProvider extends Component {
  static propTypes = {
    children: node,
  }

  /* eslint-disable react/sort-comp */

  initGoogle = async () => {
    try {
      await this.initMaps();
    }
    catch ( error ) {
      setTimeout(
        this.initGoogle,
        500,
      );
    }
  }

  initMaps = () => {
    return new Promise(( resolve, reject ) => {
      if ( window.google == null ) {
        return reject(
          new Error( 'Unable to init Google geocoder; `google` has not been initialized on the page' )
        );
      }

      const geocoder = new window.google.maps.Geocoder();
      const autocompleter = new window.google.maps.places.AutocompleteService();

      this.setState({
        geocoder,
        geocodeOK: window.google.maps.GeocoderStatus.OK,
        autocompleter,
        autocompleteOK: window.google.maps.places.PlacesServiceStatus.OK,
      }, resolve );
    });
  }

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

  geocodeAddress = ( address, options = {}) => {
    const {} = options; // eslint-disable-line
    const { geocoder, geocodeOK } = this.state;

    return new Promise(( resolve, reject ) => {
      if ( !geocoder ) {
        return reject(
          new Error( 'Unable to geocode - Google geocoder has not been initialized. Please call `initMaps()` from `GoogleConsumer`.' )
        );
      }

      geocoder.geocode({ address }, ( results, status ) => {
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
    this.initGoogle();
    this.injectGoogleScripts();
  }

  injectGoogleScripts() {
    this.injectGoogleMapsScript();
  }

  injectGoogleMapsScript() {
    const isAlreadyInjected = !!document.getElementById( '__script__google-maps' );

    if ( isAlreadyInjected )
      return;

    const apiKey = 'AIzaSyC5HjeRqeoqbxHEQWieE0g9hLaN6snjorA'; // TODO: remove hardcode

    const { apiUrl } = config.google.maps;
    const scriptTag = document.createElement( 'script' );

    scriptTag.src = `${apiUrl}?key=${apiKey}&libraries=places`;
    scriptTag.async = true;
    scriptTag.id = '__script__google-maps';

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
