import React, { Component } from 'react';
import { string } from 'prop-types';
import { Text } from '../index';
import InputAddress from './address';
import InputAutocomplete from './autocomplete';
import CheckBox from './checkbox';
import DatePicker from './datepicker';
import InputFile from './file';
import InputScroll from './scroll';
import InputRating from './rating';
import InputText from './text';
import Switch from './switch';
import InputDropdown from './dropdown';
import Passcode from './passcode';
import InputRead from './read';
import InputCurrency from './currency';
import InputCreditCard from './credit-card';
import InputCheckbox from './checkbox-2';
import InputPayment from './payment';

class Input extends Component {
  static propTypes = {
    type: string.isRequired,
  }

  blur() {
    if (
      this.input &&
      this.input.blur
    ) {
      this.input.blur();
    }
  }

  focus() {
    if (
      this.input &&
      this.input.focus
    ) {
      this.input.focus();
    }
  }

  render() {
    const { type } = this.props;

    switch ( type ) {
      case 'text':
      case 'abn number':
      case 'acn number':
      case 'double':
        return (
          <InputText
            {...this.props}
            ref={input => this.input = input}
          />
        );

      case 'email':
        return (
          <InputText
            prefixIcon="mail"
            keyboardType="email-address"
            {...this.props}
            ref={input => this.input = input}
          />
        );

      case 'textarea':
        return (
          <InputText
            multiline
            numberOfLines={3}
            height={100}
            {...this.props}
            ref={input => this.input = input}
          />
        );

      case 'mobile':
        return (
          <InputText
            prefixIcon="phone-iphone"
            keyboardType="phone-pad"
            {...this.props}
            ref={input => this.input = input}
          />
        );

      case 'landline':
        return (
          <InputText
            prefixIcon="call"
            keyboardType="phone-pad"
            {...this.props}
            ref={input => this.input = input}
          />
        );

      case 'currency':
      case 'org.javamoney.moneta.money':
        return (
          <InputCurrency
            {...this.props}
            ref={input => this.input = input}
          />
        );

      case 'java.lang.boolean':
      case 'switch':
        return (
          <Switch
            {...this.props}
            ref={input => this.input = input}
          />
        );

      case 'read':
      case 'termsandconditions':
        return (
          <InputRead
            {...this.props}
            ref={input => this.input = input}
          />
        );

      case 'scroll':
        return (
          <InputScroll
            {...this.props}
            ref={input => this.input = input}
          />
        );

      case 'rating':
        return (
          <InputRating
            {...this.props}
            ref={input => this.input = input}
          />
        );

      case 'autocomplete':
        return (
          <InputAutocomplete
            {...this.props}
            ref={input => this.input = input}
          />
        );

      case 'address':
        return (
          <InputAddress
            {...this.props}
            ref={input => this.input = input}
          />
        );

      case 'dropdown':
        return (
          <InputDropdown
            {...this.props}
            ref={input => this.input = input}
          />
        );

      case 'checkbox':
        return (
          <CheckBox
            {...this.props}
            ref={input => this.input = input}
          />
        );

      case 'radio':
        return (
          <CheckBox
            {...this.props}
            radio
            ref={input => this.input = input}
          />
        );

      case 'upload':
        return (
          <InputFile
            imageOnly
            {...this.props}
            ref={input => this.input = input}
          />
        );

      case 'file':
        return (
          <InputFile
            {...this.props}
            ref={input => this.input = input}
          />
        );

      case 'image':
        return (
          <InputFile
            {...this.props}
            imageOnly
            ref={input => this.input = input}
          />
        );

      case 'date':
      case 'java.time.localdate':
        return (
          <DatePicker
            {...this.props}
            date
            ref={input => this.input = input}
          />
        );

      case 'datetime':
      case 'java.time.localdatetime':
        return (
          <DatePicker
            {...this.props}
            date
            time
            ref={input => this.input = input}
          />
        );

      case 'mobileverification':
        return (
          <Passcode
            {...this.props}
            ref={input => this.input = input}
          />
        );

      case 'credit-card':
        return (
          <InputCreditCard
            {...this.props}
            ref={input => this.input = input}
          />
        );

      case 'checkboxmultiple':
        return (
          <InputCheckbox
            {...this.props}
            ref={input => this.input = input}
          />
        );

      case 'payment':
        return (
          <InputPayment
            {...this.props}
            ref={input => this.input = input}
          />
        );

      default:
        return (
          <Text>
            Invalid type `
            {type}
            ` specified in Input
          </Text>
        );
    }
  }
}

export default Input;
