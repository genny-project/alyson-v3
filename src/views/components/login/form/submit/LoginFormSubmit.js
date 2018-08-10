import React, { Component } from 'react';
import { string, bool } from 'prop-types';
import { Field } from 'formik';
import { Button } from '../../../../components';

class LoginFormSubmit extends Component {
  static defaultProps = {
    text: 'Submit',
  }

  static propTypes = {
    name: string,
    text: string,
    disabled: bool,
  }

  render() {
    const { text, ...restProps } = this.props;

    return (
      <Field>
        {({ form }) => (
          <Button
            {...restProps}
            onPress={form.submitForm} // eslint-disable-line react/jsx-handler-names
            text={(
              form.isSubmitting
                ? 'Working...'
                : text
            )}
          />
        )}
      </Field>
    );
  }
}

export default LoginFormSubmit;
