import React, { Component } from 'react';
import { node } from 'prop-types';
import { Api } from '../../../../utils';
import GoogleContext from '../context';

class GoogleProvider extends Component {
  static propTypes = {
    children: node,
  }

  /* eslint-disable react/sort-comp */

  autocompleteAddress = ( address, options = {}) => {
    return new Promise( async ( resolve, reject ) => {
      const { data } = await Api.getPlaceAutocomplete({
        ...options,
        address,
      });

      if ( data.status === 'OK' )
        return resolve( data.predictions );

      reject(
        new Error( `Geocode was not successful. Reason: ${data.status}` )
      );
    });
  }

  geocodeAddress = ( address, options = {}) => {
    const {} = options; // eslint-disable-line

    return new Promise( async ( resolve, reject ) => {
      const { results, status } = await Api.getGeocodedAddress({
        ...options,
        address,
      });

      if ( status === 'OK' )
        return resolve( results );

      reject(
        new Error( `Geocode was not successful. Reason: ${status}` )
      );
    });
  }

  /* eslint-enable react/sort-comp */

  state = {
    geocodeAddress: this.geocodeAddress,
    autocompleteAddress: this.autocompleteAddress,
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
