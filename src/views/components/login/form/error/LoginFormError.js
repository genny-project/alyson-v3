import React, { Component } from 'react';
import { object } from 'prop-types';
import { Field } from 'formik';
import { Box, Text } from '../../../../components';

class LoginFormError extends Component {
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

export default LoginFormError;
