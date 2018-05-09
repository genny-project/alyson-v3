import React, { Component, Fragment } from 'react';
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

    if ( !values.firstName )
      errors.firstName = 'First name is required!';

    if ( !values.lastName )
      errors.lastName = 'Last name is required!';

    return errors;
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
          <Fragment>
            <Input
              type="text"
              placeholder="e.g. John"
              label="First name"
              icon="person"
              error={touched && errors.firstName}
              onChangeText={text => setFieldValue( 'firstName', text )}
              onBlur={handleBlur}
              value={values.firstName}
            />

            {errors.firstName && (
              <Text color="red">{errors.firstName}</Text>
            )}

            <Input
              type="text"
              placeholder="e.g. Smith"
              icon="group"
              error={touched && errors.lastName}
              onChangeText={text => setFieldValue( 'lastName', text )}
              onBlur={handleBlur}
              value={values.lastName}
            />

            {errors.lastName && (
              <Text color="red">{errors.lastName}</Text>
            )}

            <Button
              disabled={!isValid}
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
          </Fragment>
        )}
      </Formik>
    );
  }
}

export default Form;
