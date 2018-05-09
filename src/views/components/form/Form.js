import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import { Input, Box, Text, Button } from '../index';

class Form extends Component {
  handleSubmit = ( values, form ) => {
    const { setSubmitting } = form;

    setSubmitting( true );
  }

  doValidate = values => {
    const errors = {};

    if (
      !values.firstName ||
      values.firstName.length < 3
    ) {
      errors.firstName = 'First name is required!';
    }

    if (
      !values.lastName ||
      values.lastName.length < 3
    ) {
      errors.lastName = 'Last name is required!';
    }

    return errors;
  }

  handleChange = ( field, setFieldValue ) => text => {
    setFieldValue( field, text );
  }

  render() {
    return (
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
        }}
        validate={this.doValidate}
        onSubmit={this.handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleSubmit,
          isSubmitting,
          isValid,
          setFieldValue,
        }) => (
          <Box
            flexDirection="column"
          >
            <Input
              type="text"
              placeholder="e.g. John"
              label="First name"
              icon="person"
              error={touched.firstName && errors.firstName}
              onChangeText={this.handleChange( 'firstName', setFieldValue )}
              onBlur={handleBlur}
              value={values.firstName}
              disabled={isSubmitting}
            />

            {(
              touched.firstName &&
              errors.firstName
            ) && (
              <Text color="red">{errors.firstName}</Text>
            )}

            <Input
              type="text"
              placeholder="e.g. Smith"
              icon="group"
              error={touched.lastName && errors.lastName}
              onChangeText={this.handleChange( 'lastName', setFieldValue )}
              onBlur={handleBlur}
              value={values.lastName}
              disabled={isSubmitting}
            />

            {(
              touched.lastName &&
              errors.lastName
            ) && (
              <Text color="red">{errors.lastName}</Text>
            )}

            <Button
              disabled={!isValid || isSubmitting}
              color="green"
              onPress={handleSubmit}
            >
              Submit
            </Button>

            {isSubmitting && (
              <Box>
                <ActivityIndicator />
                <Text>Submitting...</Text>
              </Box>
            )}
          </Box>
        )}
      </Formik>
    );
  }
}

export default Form;
