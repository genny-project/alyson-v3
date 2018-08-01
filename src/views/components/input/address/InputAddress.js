import React, { Component } from 'react';
import { func, number, object, array, string } from 'prop-types';
import debounce from 'lodash.debounce';
import dlv from 'dlv';
import { Input, GoogleConsumer } from '../../index';

class InputAddress extends Component {
  static defaultProps = {
    debounceTimer: 300,
    includeAddressFields: [
      'street_number',
      'route',
      'locality',
      'administrative_area_level_1',
      'postal_code',
      'country',
    ],
    excludeAddressFields: [],
    mapAddressComponentToField: {
      route: 'street_name',
      locality: 'suburb',
      administrative_area_level_1: 'state',
    },
    injectCustomAddressComponents: {
      street_address: '{{street_number}} {{street_name}}',
    },
    prefixIcon: 'place',
    icon: 'expand-more',
    placeholder: 'Select an address...',
    getShortNameForAddressComponents: ['country'],
  }

  static propTypes = {
    icon: string,
    prefixIcon: string,
    placeholder: string,
    onChange: func,
    onChangeValue: func,
    debounceTimer: number,
    google: object,
    includeAddressFields: array,
    excludeAddressFields: array,
    mapAddressComponentToField: object,
    injectCustomAddressComponents: object,
    getShortNameForAddressComponents: array,
  }

  constructor( props ) {
    super( props );

    this.autocompleteAddress = debounce(
      this.autocompleteAddress,
      this.props.debounceTimer
    );
  }

  state = {
    items: [],
  }

  autocompleteAddress = async address => {
    const { google } = this.props;

    try {
      const items = await google.autocompleteAddress( address );

      this.setState({ items });
    }
    catch ( error ) {
      console.warn( error );
    }
  }

  geocodeAddress = async address => {
    const { google } = this.props;

    try {
      await google.geocodeAddress( address );
    }
    catch ( error ) {
      console.warn( error );
    }
  }

  handleFillCustomAddressPath = addressComponents => path => {
    /* Remove the ending }} from the dirty path, and
    * keep the delimiter at the end in a separate array
    * element.
    */
    const tokens = path.split( '}}' );

    /* Set the first token, which is the sanitized path,
      * to be the corresponding value from the key in
      * `components`.
      */
    tokens[0] = dlv( addressComponents, tokens[0] );

    /* Re-combine tokens back to a single string. */
    return tokens.join( '' );
  }

  handleFilterAddressComponents = ({ types }) => {
    const { includeAddressFields, excludeAddressFields } = this.props;

    for ( const type of types ) {
      if (
        includeAddressFields.includes( type ) &&
        !excludeAddressFields.includes( type )
      ) {
        return true;
      }
    }

    return false;
  }

  handleReduceAddressComponent = ( resultant, addressComponent ) => {
    const {
      includeAddressFields,
      mapAddressComponentToField,
      getShortNameForAddressComponents,
    } = this.props;

    const { long_name, short_name, types } = addressComponent;

    types.forEach( type => {
      if ( includeAddressFields.includes( type )) {
        const key = mapAddressComponentToField[type] || type;

        if ( getShortNameForAddressComponents.includes( key ))
          resultant[key] = short_name;
        else
          resultant[key] = long_name;
      }
    });

    return resultant;
  }

  handleChange = async item => {
    const { google } = this.props;
    const { place_id } = item;

    try {
      const places = await google.geocodeAddress({ place_id });

      if (
        !places ||
        !( places instanceof Array ) ||
        !places.length
      ) {
        throw new Error( `Unable to find geocoded results for placeId ${place_id}` );
      }

      const formattedPlace = this.formatPlace( places[0] );

      if ( this.props.onChange ) {
        this.props.onChange({
          target: {
            value: formattedPlace,
          },
        });
      }

      if ( this.props.onChangeValue )
        this.props.onChangeValue( formattedPlace );
    }
    catch ( error ) {
      console.warn( error );
    }
  }

  handleType = text => {
    this.autocompleteAddress( text );
  }

  formatPlace( place ) {
    try {
      const { injectCustomAddressComponents } = this.props;
      const { formatted_address, address_components, geometry } = place;

      const components =
        address_components
          .filter( this.handleFilterAddressComponents )
          .reduce( this.handleReduceAddressComponent, {});

      const customComponents =
        injectCustomAddressComponents
          ? this.createCustomAddressComponents( components )
          : {};

      return {
        ...components,
        full_address: formatted_address,
        latitude: geometry.location.lat,
        longitude: geometry.location.lng,
        ...customComponents,
      };
    }
    catch ( error ) {
      throw new Error( 'Attempted to invoke `formatPlace` without a valid place object', error );
    }
  }

  createCustomAddressComponents( addressComponents ) {
    const { injectCustomAddressComponents } = this.props;

    return Object
      .keys( injectCustomAddressComponents )
      .reduce(( resultant, customAddressComponent ) => {
        const component =
          injectCustomAddressComponents[customAddressComponent]
            .split( '{{' )
            .map( this.handleFillCustomAddressPath( addressComponents ))
            .join( '' );

        resultant[customAddressComponent] = component;

        return resultant;
      }, {});
  }

  render() {
    const { prefixIcon, placeholder, icon, ...restProps } = this.props;
    const { items } = this.state;

    return (
      <Input
        {...restProps}
        type="autocomplete"
        items={items}
        borderBetweenItems
        inputProps={{
          placeholder,
          prefixIcon,
          icon,
        }}
        onType={this.handleType}
        itemStringKey="description"
        onChange={this.handleChange}
      />
    );
  }
}

export default props => (
  <GoogleConsumer>
    {google => (
      <InputAddress
        {...props}
        google={google}
      />
    )}
  </GoogleConsumer>
);
