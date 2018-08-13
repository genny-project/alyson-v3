import React, { Component } from 'react';
import { string, bool } from 'prop-types';
import { Field } from 'formik';
import { Button } from '../../index';

class FormGenericSubmit extends Component {
  static defaultProps = {
    text: 'Submit',
    submittingText: 'Working...',
  }

  static propTypes = {
    name: string,
    text: string,
    disabled: bool,
    submittingText: string,
  }

  render() {
    const { text, submittingText, ...restProps } = this.props;

    return (
      <Field>
        {({ form }) => (
          <Button
            {...restProps}
            onPress={form.submitForm} // eslint-disable-line react/jsx-handler-names
            text={(
              form.isSubmitting
                ? submittingText
                : text
            )}
          />
        )}
      </Field>
    );
  }
}

export default FormGenericSubmit;
