import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { string, object } from 'prop-types';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import dlv from 'dlv';
import { Input, Box, Text, Button, Heading } from '../index';

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
    const { baseEntities, questionGroupCode, asks } = this.props;
    const questionGroup = asks[questionGroupCode];
    const types = dlv( baseEntities, 'definitions.types' );
    const errors = {};

    Object.keys( values ).forEach( value_key => {
      const dataTypes = dlv( baseEntities, 'definitions.data' );
      const ask = questionGroup.childAsks.filter( child => child.questionCode === value_key )[0];
      // console.log( ask );
      const attributeData = dataTypes[ask.attributeCode];
      const validationList = types[attributeData.dataType].validationList;
    
      if (
        validationList &&
        validationList.length > 0
      ) {
        const isValid = validationList.every( validation => {
          return new RegExp( validation.regex ).test( values[value_key] );
        });

        // console.log( validationList, values[value_key], isValid );

        if ( !isValid ) {
          errors[value_key] = 'Error';
        }
      }
    });

    return errors;
  }

  handleChange = ( field, setFieldValue, setFieldTouched ) => text => {
    setFieldValue( field, text );
    setFieldTouched( field, true );
  }

  handleSubmit = ( values, form ) => {
    const { setSubmitting } = form;

    setSubmitting( true );
  }

  renderInput = ( values, errors, touched, setFieldValue, setTouched ) => input  => {
    const { definitions } = this.props.baseEntities;
    const { questionCode, attributeCode, name } = input;
    const { dataType } = definitions.data[attributeCode];
    // console.log(values[questionCode], touched[questionCode], errors[questionCode])
    
    return (
      <Box
        key={questionCode}
        flexDirection="column"
      >
        <Box
          key={questionCode}
          flexDirection="row"
          justifyContent="flex-start"
        >
          <Text>
            {name}
          </Text>

          {(
            touched[questionCode] &&
            errors[questionCode]
          ) && (
            <Text color="red">
              {errors[questionCode]}
            </Text>
          )}
        </Box>
        <Input
          onChangeValue={this.handleChange( questionCode, setFieldValue, setTouched )}
          value={values[questionCode]}
          type={dataType.toLowerCase()}
          error={touched[questionCode] && errors[questionCode]}
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
          justifyContent="center"
          alignItems="center"
        >
          <ActivityIndicator size="large" />

          <Box height={10} />

          <Text
            align="center"
          >
            Loading form...
          </Text>
        </Box>
      );
    }
    const initialValues = {};
    
    questionGroup.childAsks.forEach(( ask ) => {
      initialValues[ask.questionCode] = '';
    });

    return (
      <Formik
        initialValues={initialValues}
        validate={this.doValidate}
        onSubmit={this.handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          isSubmitting,
          isValid,
          setFieldValue,
          setFieldTouched,
        }) => {
          return (
            <Box
              flexDirection="column"
              width="100%"
            >
              <Heading>
                {questionGroup.name}
              </Heading>

              {questionGroup.childAsks.map(
                this.renderInput(
                  values,
                  errors,
                  touched,
                  setFieldValue,
                  setFieldTouched
                )
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
                  <Text>
                    Submitting...
                  </Text>
                </Box>
              )}
            </Box>
          );
        }}
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
