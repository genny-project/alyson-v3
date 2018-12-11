/* eslint-disable react/jsx-handler-names */
import React, { Component } from 'react';
import { bool, string, node } from 'prop-types';
import { Field } from 'formik';
import { Input } from '../../index';

class FormGenericInput extends Component {
  static defaultProps = {
    testID: 'form-generic-input',
  }

  static propTypes = {
    children: node,
    disabled: bool,
    name: string,
    testID: string,
  }

  render() {
    const { name, disabled, testID, ...restProps } = this.props;

    return (
      <Field>
        {({ form }) => {
          return (
            <Input
              {...restProps}
              name={name}
              disabled={disabled || form.isSubmitting}
              value={form.values ? form.values[name] : ''}
              onSubmitEditing={form.submitForm}
              onChangeValue={value => {
                form.setFieldTouched( name, true );
                form.setFieldValue( name, value );
              }}
              testID={testID}
            />
          );
        }}
      </Field>
    );
  }
}

export default FormGenericInput;
