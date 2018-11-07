import React, { Component } from 'react';
import { string, object, func } from 'prop-types';
import debounce from 'lodash.debounce';
import { Input } from '../../index';
import FormInputDropdown from './dropdown';
import FormInputCheckbox from './checkbox';

class FormInput extends Component {
  static propTypes = {
    type: string.isRequired,
    question: object,
    onChangeValue: func.isRequired,
  }

  constructor( props ) {
    super( props );

    this.handleChangeDebounced = debounce( this.handleChangeDebounced, 300 );
  }

  handleChangeDebounced = ( value, withSend ) => {
    this.props.onChangeValue( value, withSend );
  }

  handleChangeValueWithSend = value => {
    this.props.onChangeValue( value, true );
  }

  handleChangeValueWithSendAndDebounce = value => {
    this.handleChangeDebounced( value, true );
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
    const { type, question } = this.props;

    switch ( type ) {
      case 'termsandconditions':
        return (
          <Input
            {...this.props}
            html={question.html}
            onChangeValue={this.handleChangeValueWithSend}
            ref={input => this.input = input}
          />
        );

      case 'segmentedcontrol':
      case 'dropdown':
      case 'tag':
        return (
          <FormInputDropdown
            {...this.props}
            onChangeValue={this.handleChangeValueWithSendAndDebounce}
            ref={input => this.input = input}
          />
        );

      case 'checkboxmultiple':
        return (
          <FormInputCheckbox
            {...this.props}
            ref={input => this.input = input}
            onChangeValue={this.handleChangeValueWithSendAndDebounce}
          />
        );

      case 'switch':
      case 'java.lang.boolean':
      case 'payment':
      case 'audioRecord':
      case 'audiorecord':
      case 'date':
      case 'java.time.localdate':
      case 'datetime':
      case 'codeverificationfive':
      case 'codeVerificationFive':
      case 'mobileverification':
      case 'java.time.localdatetime':
        return (
          <Input
            {...this.props}
            onChangeValue={this.handleChangeValueWithSendAndDebounce}
            ref={input => this.input = input}
          />
        );

      case 'upload':
      case 'file':
      case 'image':
      case 'signature':
        return (
          <Input
            {...this.props}
            onChangeValue={this.handleChangeValueWithSend}
            ref={input => this.input = input}
          />
        );

      default:
        return (
          <Input
            {...this.props}
            ref={input => this.input = input}
          />
        );
    }
  }
}

export default FormInput;
