import React, { Component } from 'react';
import { func, string } from 'prop-types';
import { Input } from '../../index';

class InputCurrency extends Component {
  static defaultProps = {
    prefixIcon: 'attach-money',
    defaultCurrency: 'AUD',
    placeholder: 'Enter an amount...',
  }

  static propTypes = {
    icon: string,
    placeholder: string,
    onChange: func,
    onChangeValue: func,
    prefixIcon: string,
    defaultCurrency: string,
  }

  state = {
    // currency: this.props.defaultCurrency,
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
    const { icon, placeholder, prefixIcon, ...restProps } = this.props;
    const { value } = this.state;

    return (
      <Input
        {...restProps}
        type="text"
        keyboardType="numeric"
        placeholder={placeholder}
        value={value}
        onChangeValue={this.handleChangeValue}
        prefixIcon={prefixIcon}
        icon={icon}
      />
    );
  }
}

export default InputCurrency;
