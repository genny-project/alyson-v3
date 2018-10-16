import React, { Component } from 'react';
import { object, string } from 'prop-types';
import { Field } from 'formik';
import { Box, Text } from '../../index';

class FormGenericStatus extends Component {
  static defaultProps = {
    testID: 'form-generic-status',
  }

  static propTypes = {
    wrapperProps: object,
    textProps: object,
    testID: string,
  }

  render() {
    const { wrapperProps, textProps, testID } = this.props;

    return (
      <Field>
        {({ form }) => (
          form.status ? (
            <Box
              {...wrapperProps}
              testID={testID}
            >
              <Text {...textProps}>
                {form.status}
              </Text>
            </Box>
          ) : null
        )}
      </Field>
    );
  }
}

export default FormGenericStatus;
