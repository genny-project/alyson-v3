import React, { Component } from 'react';
import { func, number, object } from 'prop-types';
import debounce from 'lodash.debounce';
import { Input } from '../../index';

class InputAddress extends Component {
  static defaultProps = {
    inputType: 'text',
    debounceTimer: 300,
  }

  static propTypes = {
    inputProps: object,
    onChange: func,
    debounceTimer: number,
  }

  constructor( props ) {
    super( props );

    this.fetchAddresses = debounce(
      this.fetchAddresses,
      this.props.debounceTimer
    );
  }

  state = {
    items: [],
    fetching: false,
    error: null,
  }

  fetchAddresses = address => {
    console.log( 'fetching addresses...', address ); // eslint-disable-line no-console
  }

  handleChange = item => {
    console.log( item ); // eslint-disable-line no-console

    if ( this.props.onChange )
      this.props.onChange( item );
  }

  handleType = text => {
    this.fetchAddresses( text );
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
      />
    );
  }
}

export default InputAddress;
