import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { string, object } from 'prop-types';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { Input, Box, Text, Button, Heading } from '../index';
/* eslint-disable */

class Form extends Component {
  static propTypes = {
    questionGroupCode: string,
    asks: object,
    baseEntities: object,
  }

  getQuestionGroup() {
    const { questionGroupCode, asks } = this.props;

    return asks[questionGroupCode];
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

  handleSubmit = ( values, form ) => {
    const { setSubmitting } = form;

    setSubmitting( true );
  }

  renderInput = input => {
    const { definitions } = this.props.baseEntities;
    const { questionCode, attributeCode, name } = input;
    const { dataType } = definitions.data[attributeCode];

    return (
      <Box
        key={questionCode}
        flexDirection="column"
      >
        <Text>
          {name}
        </Text>

        <Input
          type={dataType.toLowerCase()}
        />
      </Box>
    );
  }

  render() {
    const questionGroup = this.getQuestionGroup();

    if ( !questionGroup ) {
      return (
        <Box
          flexDirection="column"
          width="100%"
        >
          <ActivityIndicator size="large" />

          <Text>
            Loading form...
          </Text>
        </Box>
      );
    }

    return (
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
            <Heading>
              {questionGroup.name}
            </Heading>

            {questionGroup.childAsks.map( this.renderInput )}

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
    );
  }
}

export { Form };

const mapStateToProps = state => ({
  baseEntities: state.vertx.baseEntities,
  aliases: state.vertx.aliases,
  asks: state.vertx.asks,
});

export default connect( mapStateToProps )( Form );
