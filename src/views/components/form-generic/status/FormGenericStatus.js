import React, { Component } from 'react';
import { object } from 'prop-types';
import { Field } from 'formik';
import { Box, Text } from '../../index';

class FormGenericStatus extends Component {
  static propTypes = {
    wrapperProps: object,
    textProps: object,
  }

  render() {
    const { wrapperProps, textProps } = this.props;

    return (
      <Field>
        {({ form }) => (
          form.status ? (
            <Box {...wrapperProps}>
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
