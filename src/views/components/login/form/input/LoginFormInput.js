import React, { Component } from 'react';
import { bool, string, node } from 'prop-types';
import { Field } from 'formik';
import { Input } from '../../../../components';

class LoginFormInput extends Component {
  static propTypes = {
    children: node,
    disabled: bool,
    name: string,
  }

  render() {
    const { name, disabled, ...restProps } = this.props;

    return (
      <Field>
        {({ form }) => (
          <Input
            {...restProps}
            name={name}
            disabled={disabled || form.isSubmitting}
            onChangeValue={value => {
              form.setFieldTouched( name, true );
              form.setFieldValue( name, value );
            }}
            value={form.values[name]}
          />
        )}
      </Field>
    );
  }
}

export default LoginFormInput;
