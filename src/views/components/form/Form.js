import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { string, object } from 'prop-types';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import dlv from 'dlv';
import { Bridge } from '../../../utils/vertx';
import { Input, Box, Text, Button, Heading } from '../index';

class Form extends Component {
  static propTypes = {
    questionGroupCode: string,
    asks: object,
    baseEntities: object,
  }

  state = {
    errors: {},
    values: {},
  }

  getQuestionGroup() {
    const { questionGroupCode, asks } = this.props;

    return asks[questionGroupCode];
  }

  doValidate = values => {
    const { baseEntities, questionGroupCode, asks } = this.props;
    const questionGroup = asks[questionGroupCode];
    const types = dlv( baseEntities, 'definitions.types' );

    const newState = {};

    Object.keys( values ).forEach( value_key => {
      const dataTypes = dlv( baseEntities, 'definitions.data' );
      const ask = questionGroup.childAsks.filter( child => child.questionCode === value_key )[0];
      const attributeData = dataTypes[ask.attributeCode];
      const validationList = types[attributeData.dataType].validationList;

      if (
        validationList &&
        validationList.length > 0
      ) {
        const isValid = validationList.every( validation => {
          return new RegExp( validation.regex ).test( values[value_key] );
        });

        if ( !isValid ) {
          newState[value_key] = 'Error';
        }
      }
    });
    
    return newState;
  }

  sendAnswer = ( ask, newValue ) => {
    let finalValue = newValue;
    let finalAttributeCode = ask.attributeCode;

    if ( ask.attributeCode.indexOf( 'PRICE' ) !== -1 || ask.attributeCode.indexOf( 'FEE' ) !== -1 ) {
      finalValue = JSON.stringify({
        amount: newValue,
        currency: 'AUD',
      });
    } else if ( ask.attributeCode.indexOf( 'ADDRESS_FULL' ) !== -1 ) {
      finalAttributeCode = ask.attributeCode.replace( 'ADDRESS_FULL', 'ADDRESS_JSON' );
      finalValue = JSON.stringify( finalValue );
    } else if ( ask.attributeCode.indexOf( 'PRI_RATING' ) !== -1 ) {
      finalAttributeCode = 'PRI_RATING_RAW';
    }

    Bridge.sendAnswer( [{
      askId: ask.id,
      attributeCode: finalAttributeCode,
      sourceCode: ask.sourceCode,
      targetCode: ask.targetCode,
      code: ask.questionCode,
      questionGroup: this.getQuestionGroup().name,
      identifier: ask.questionCode,
      weight: ask.weight,
      value: finalValue,
    }] );
  }

  handleChange = ( field, setFieldValue, setFieldTouched ) => text => {
    setFieldValue( field, text );
    setFieldTouched( field, true );
    this.setState(( oldState ) => ({
      values: {
        ...oldState.values,
        field: text,
      },
    }));
  }

  handleSubmit = ( values, form ) => {
    const { setSubmitting } = form;

    setSubmitting( true );

    const { questionGroupCode } = this.props;
    const questionGroup = this.getQuestionGroup();

    /* send event to back end */
    const eventData = {
      code: questionGroupCode,
      value: JSON.stringify({
        targetCode: questionGroup.targetCode,
        action: 'submit',
      }),
    };

    Bridge.sendButtonEvent( 'FORM_SUBMIT', eventData );
  }

  handleBlur = ( ask ) => () => {
    if ( ask ) {
      const questionCode = ask.questionCode;

      if ( questionCode && !this.state.errors[questionCode] && this.state.values[questionCode] ) {
        this.sendAnswer( ask, this.state.values[questionCode] );
      }
    }
  }

  componentWillReceiveProps( newProps ) {
    if ( newProps.questionGroupCode === this.props.questionGroupCode ) {
      this.setState({
        errors: {},
        values: {},
      }, () => {
        return true;
      });
    }
  }

  renderInput = ( values, errors, touched, setFieldValue, setTouched ) => ask => {
    const { definitions } = this.props.baseEntities;
    const { questionCode, attributeCode, name } = ask;
    const { dataType } = definitions.data[attributeCode];

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
          onChangeValue={this.handleChange( questionCode, setFieldValue, setTouched, ask )}
          value={values[questionCode]}
          type={dataType.toLowerCase()}
          error={touched[questionCode] && errors[questionCode]}
          onBlur={this.handleBlur( ask, values )}
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
      initialValues[ask.questionCode] = (
        this.props.baseEntities.attributes[ask.targetCode] &&
          this.props.baseEntities.attributes[ask.targetCode][ask.attributeCode] &&
          this.props.baseEntities.attributes[ask.targetCode][ask.attributeCode].valueString
      );
    });

    return (
      <Formik
        initialValues={initialValues}
        validate={this.doValidate}
        onSubmit={this.handleSubmit}
        validateOnBlur
        enableReinitialize
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
