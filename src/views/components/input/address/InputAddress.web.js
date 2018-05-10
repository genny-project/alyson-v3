import React, { Component } from 'react';
import { func, string, number } from 'prop-types';
import debounce from 'lodash.debounce';
import { Input } from '../../index';

class InputAddress extends Component {
  static defaultProps = {
    inputType: 'text',
    placeholder: 'Search an address...',
    debounceTimer: 300,
  }

  static propTypes = {
    placeholder: string,
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
    const { placeholder } = this.props;
    const { items } = this.state;

    return (
      <Input
        type="autocomplete"
        items={items}
        borderBetweenItems
        inputProps={{
          placeholder,
        }}
        onType={this.handleType}
      />
    );
  }
}

export default InputAddress;
