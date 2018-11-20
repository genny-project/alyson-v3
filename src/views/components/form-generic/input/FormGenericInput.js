import React, { Component } from 'react';
import { bool, string, node } from 'prop-types';
import { Field } from 'formik';
import { Input } from '../../index';

class FormGenericInput extends Component {
  static propTypes = {
    children: node,
    disabled: bool,
    name: string,
  }

  render() {
    const { name, disabled, ...restProps } = this.props;

    return (
      <Field>
        {({ form }) => {
          return (
            <Input
              {...restProps}
              name={name}
              disabled={disabled || form.isSubmitting}
              value={form.values ? form.values[name] : ''}
              onChangeValue={value => {
                form.setFieldTouched( name, true );
                form.setFieldValue( name, value );
              }}
            />
          );
        }}
      </Field>
    );
  }
}

export default FormGenericInput;
