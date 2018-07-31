import React, { Component } from 'react';
import { string, object, func } from 'prop-types';
import { Input } from '../../index';
import FormInputDropdown from './dropdown';
import FormInputCheckbox from './checkbox';

class FormInput extends Component {
  static propTypes = {
    type: string.isRequired,
    question: object,
    onChangeValue: func.isRequired,
  }

  handleChangeValueWithSend = value => {
    this.props.onChangeValue( value, true );
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

      case 'address':
        return (
          <Input
            {...this.props}
            onChangeValue={this.handleChangeValueWithSend}
            ref={input => this.input = input}
          />
        );

      case 'dropdown':
        return (
          <FormInputDropdown
            {...this.props}
            ref={input => this.input = input}
          />
        );

      case 'checkboxmultiple':
        return (
          <FormInputCheckbox
            {...this.props}
            ref={input => this.input = input}
            onChangeValue={this.handleChangeValueWithSend}
          />
        );

      case 'upload':
      case 'switch':
      case 'java.lang.boolean':
      case 'payment':
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
