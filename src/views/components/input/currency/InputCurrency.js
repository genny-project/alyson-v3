import React, { Component } from 'react';
import { func, string } from 'prop-types';
import { Input } from '../../index';

class InputCurrency extends Component {
  static defaultProps = {
    defaultCurrency: 'AUD',
    placeholder: 'Enter an amount...',
  }

  static propTypes = {
    placeholder: string,
    onChange: func,
    onChangeValue: func,
    defaultCurrency: string,
  }

  state = {
    currency: this.props.defaultCurrency,
    value: '',
  }

  handleChangeValue = value => {
    const { currency } = this.state;

    this.setState({ value });

    if ( this.props.onChangeValue ) {
      this.props.onChangeValue({
        amount: value,
        currency,
      });
    }
  }

  render() {
    const { placeholder, ...restProps } = this.props;
    const { value } = this.state;

    return (
      <Input
        {...restProps}
        type="text"
        keyboardType="numeric"
        placeholder={placeholder}
        value={value}
        onChangeValue={this.handleChangeValue}
      />
    );
  }
}

export default InputCurrency;
