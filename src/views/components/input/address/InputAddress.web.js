import React, { Component } from 'react';
import { func, number, object } from 'prop-types';
import debounce from 'lodash.debounce';
import { Input, GoogleConsumer } from '../../index';

class InputAddress extends Component {
  static defaultProps = {
    inputType: 'text',
    debounceTimer: 300,
  }

  static propTypes = {
    inputProps: object,
    onChange: func,
    debounceTimer: number,
    google: object,
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
    fetching: false,
    error: null,
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

  handleChange = item => {
    console.log( item ); // eslint-disable-line no-console

    if ( this.props.onChange )
      this.props.onChange( item );
  }

  handleType = text => {
    this.autocompleteAddress( text );
  }

  render() {
    const { inputProps } = this.props;
    const { items } = this.state;

    return (
      <Input
        type="autocomplete"
        items={items}
        borderBetweenItems
        inputProps={{
          placeholder: 'Type an address...',
          icon: 'place',
          ...inputProps,
        }}
        onType={this.handleType}
        itemStringKey="description"
      />
    );
  }
}

export default props => (
  <GoogleConsumer>
    {google => (
      <InputAddress {...props} google={google} />
    )}
  </GoogleConsumer>
);
