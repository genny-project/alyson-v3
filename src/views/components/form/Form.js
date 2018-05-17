import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import { Input, Box, Text, Button, ScrollView } from '../index';

class Form extends Component {
  handleSubmit = ( values, form ) => {
    const { setSubmitting } = form;

    setSubmitting( true );
  }

  doValidate = values => {
    /**
     *  use validation methods received from backend
     */
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
    // console.log(field, text);
    setFieldValue( field, text );
  }

  render() {
    return (
      <ScrollView>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            options: [],
            rating: 4,
            terms: false,
            actions: 'abscond',
            date: '',
            datetime: '',
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
              width="100%"
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
                <Text color="red">
                  {errors.firstName}
                </Text>
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
                <Text color="red">
                  {errors.lastName}
                </Text>
              )}

              {values.terms ? (
                <Text>
                  Terms scrolled to bottom!
                </Text>
              ) : null}

              <Input
                type="scroll"
                disabled={isSubmitting}
                onScrollEnd={this.handleChange( 'terms', setFieldValue )}
              >
                <Text>
                  Lorem ipsum dolor sit amet, ad ornatus propriae vim, saepe sadipscing an eam.
                  Alia tibique dissentiet id quo, in pro mollis oblique persequeris.
                  Agam splendide adolescens ea sea, eleifend salutatus sadipscing nam an.
                  An erat denique maiestatis usu.
                  Lorem ipsum dolor sit amet, ad ornatus propriae vim, saepe sadipscing an eam.
                  Alia tibique dissentiet id quo, in pro mollis oblique persequeris.
                  Agam splendide adolescens ea sea, eleifend salutatus sadipscing nam an.
                  An erat denique maiestatis usu.
                  Lorem ipsum dolor sit amet, ad ornatus propriae vim, saepe sadipscing an eam.
                  Alia tibique dissentiet id quo, in pro mollis oblique persequeris.
                  Agam splendide adolescens ea sea, eleifend salutatus sadipscing nam an.
                  An erat denique maiestatis usu.
                  Lorem ipsum dolor sit amet, ad ornatus propriae vim, saepe sadipscing an eam.
                  Alia tibique dissentiet id quo, in pro mollis oblique persequeris.
                  Agam splendide adolescens ea sea, eleifend salutatus sadipscing nam an.
                  An erat denique maiestatis usu.
                  Lorem ipsum dolor sit amet, ad ornatus propriae vim, saepe sadipscing an eam.
                  Alia tibique dissentiet id quo, in pro mollis oblique persequeris.
                  Agam splendide adolescens ea sea, eleifend salutatus sadipscing nam an.
                  An erat denique maiestatis usu.
                  Lorem ipsum dolor sit amet, ad ornatus propriae vim, saepe sadipscing an eam.
                  Alia tibique dissentiet id quo, in pro mollis oblique persequeris.
                  Agam splendide adolescens ea sea, eleifend salutatus sadipscing nam an.
                  An erat denique maiestatis usu.
                  Lorem ipsum dolor sit amet, ad ornatus propriae vim, saepe sadipscing an eam.
                  Alia tibique dissentiet id quo, in pro mollis oblique persequeris.
                  Agam splendide adolescens ea sea, eleifend salutatus sadipscing nam an.
                  An erat denique maiestatis usu.
                  Lorem ipsum dolor sit amet, ad ornatus propriae vim, saepe sadipscing an eam.
                  Alia tibique dissentiet id quo, in pro mollis oblique persequeris.
                  Agam splendide adolescens ea sea, eleifend salutatus sadipscing nam an.
                  An erat denique maiestatis usu.
                  Lorem ipsum dolor sit amet, ad ornatus propriae vim, saepe sadipscing an eam.
                  Alia tibique dissentiet id quo, in pro mollis oblique persequeris.
                  Agam splendide adolescens ea sea, eleifend salutatus sadipscing nam an.
                  An erat denique maiestatis usu.
                  Lorem ipsum dolor sit amet, ad ornatus propriae vim, saepe sadipscing an eam.
                  Alia tibique dissentiet id quo, in pro mollis oblique persequeris.
                  Agam splendide adolescens ea sea, eleifend salutatus sadipscing nam an.
                  An erat denique maiestatis usu.
                </Text>
              </Input>
              
              <Input
                type="rating"
                onChange={this.handleChange( 'rating', setFieldValue )}
                value={values.rating}
              />

              <Input
                type="checkbox"
                // onChangeText={this.handleChange( 'rating', setFieldValue )}
                items={['aggrieve', 'abscond', 'acquiesce', 'acquire']}
                onChangeValue={this.handleChange( 'options', setFieldValue )}
                value={values.options}
              />

              <Input
                type="radio"
                // onChangeText={this.handleChange( 'rating', setFieldValue )}
                items={['aggrieve', 'abscond', 'acquiesce', 'acquire']}
                // onChangeText={this.handleChange( 'checkbox', setFieldValue )}
                onChangeValue={this.handleChange( 'actions', setFieldValue )}
                value={values.actions}
              />

              <Input
                type="file"
              />

              <Input
                type="address"
              />

              <Input
                type="date"
                onChangeValue={this.handleChange( 'date', setFieldValue )}
                value={values.date}
              />

              <Input
                type="datetime"
                onChangeValue={this.handleChange( 'datetime', setFieldValue )}
                value={values.datetime}
              />

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
                  <Text>
                    Submitting...
                  </Text>
                </Box>
              )}
            </Box>
          )}
        </Formik>
      </ScrollView>
    );
  }
}

export default Form;
