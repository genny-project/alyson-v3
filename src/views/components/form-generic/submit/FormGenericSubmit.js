import React, { Component } from 'react';
import { string, bool, object } from 'prop-types';
import { Button } from '../../index';

class FormGenericSubmit extends Component {
  static defaultProps = {
    text: 'Submit',
    submittingText: 'Working...',
    testID: 'form-generic-submit',
  }

  static propTypes = {
    text: string,
    disabled: bool,
    disabledWhenFormInvalid: bool,
    submittingText: string,
    testID: string,
    formProps: object,
  }

  render() {
    const {
      text,
      submittingText,
      disabled,
      disabledWhenFormInvalid,
      testID,
      formProps,
      ...restProps
    } = this.props;

    return (
      <Button
        {...restProps}
        disabled={disabled || ( disabledWhenFormInvalid && formProps && !formProps.isValid )}
        onPress={formProps ? formProps.submitForm : null}
        text={(
          ( formProps && formProps.isSubmitting )
            ? submittingText
            : text
        )}
        testID={testID}
        onKeyPress={formProps ? formProps.submitForm : null}
      />
    );
  }
}

export default FormGenericSubmit;
