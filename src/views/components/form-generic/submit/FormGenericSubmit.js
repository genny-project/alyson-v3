import React, { Component } from 'react';
import { string, bool } from 'prop-types';
import { Field } from 'formik';
import { Button } from '../../index';

class FormGenericSubmit extends Component {
  static defaultProps = {
    text: 'Submit',
    submittingText: 'Working...',
    testID: 'form-generic-submit',
  }

  static propTypes = {
    name: string,
    text: string,
    disabled: bool,
    submittingText: string,
    testID: string,
  }

  render() {
    const { text, submittingText, testID, ...restProps } = this.props;

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
            testID={testID}
          />
        )}
      </Field>
    );
  }
}

export default FormGenericSubmit;
