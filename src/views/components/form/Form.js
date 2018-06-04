import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { string, object } from 'prop-types';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import dlv from 'dlv';
import { Bridge } from '../../../utils/vertx';
import { Box, Text, Button, Heading, Icon, KeyboardAwareScrollView } from '../index';
import FormInput from './input';

class Form extends Component {
  static propTypes = {
    questionGroupCode: string,
    asks: object,
    baseEntities: object,
  }

  componentDidCatch( error ) {
    console.warn( error );
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

    if ( !values )
      return newState;

    Object.keys( values ).forEach( value_key => {
      const dataTypes = dlv( baseEntities, 'definitions.data' );
      const ask = questionGroup.childAsks.filter( child => child.questionCode === value_key )[0];
      const attributeData = dataTypes[ask.attributeCode];
      const validationList = types[attributeData.dataType].validationList;

      if (
        values[value_key] == null &&
        ask.mandatory
      ) {
        newState[value_key] = 'Please enter this field';
      }

      else if (
        validationList &&
        validationList.length > 0
      ) {
        const isValid = validationList.every( validation => {
          return new RegExp( validation.regex ).test( String( values[value_key] ));
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

    console.warn( 'sending answer...', {
      askId: ask.id,
      attributeCode: finalAttributeCode,
      sourceCode: ask.sourceCode,
      targetCode: ask.targetCode,
      code: ask.questionCode,
      questionGroup: this.getQuestionGroup().name,
      identifier: ask.questionCode,
      weight: ask.weight,
      value: finalValue,
    });

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

  handleChange = ( field, setFieldValue, setFieldTouched, ask ) => ( value, sendOnChange ) => {
    if ( value == null )
      return;

    setFieldValue( field, value );
    setFieldTouched( field, true );

    if ( sendOnChange )
      this.sendAnswer( ask, value );
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

  handleBlur = ( ask, values, errors ) => () => {
    if ( ask ) {
      const questionCode = ask.questionCode;

      if (
        questionCode &&
        (
          !errors ||
          !errors[questionCode]
        ) &&
        (
          values &&
          values[questionCode]
        )
      ) {
        this.sendAnswer( ask, values[questionCode] );
      }
    }
  }

  renderInput = ( values, errors, touched, setFieldValue, setTouched ) => ask => {
    const { definitions } = this.props.baseEntities;
    const { questionCode, attributeCode, name, mandatory, question, childAsks } = ask;
    const { dataType } = definitions.data[attributeCode];

    if (
      childAsks &&
      childAsks instanceof Array &&
      childAsks.length > 0
    ) {
      return (
        <Box
          flexDirection="column"
        >
          <Heading>
            {name}
          </Heading>

          <Box
            marginTop={20}
            marginBottom={20}
            flexDirection="column"
          >
            {childAsks.map( this.renderInput( values, errors, touched, setFieldValue, setTouched ))}
          </Box>
        </Box>
      );
    }

    return (
      <Box
        key={questionCode}
        flexDirection="column"
        marginBottom={20}
      >
        <Box
          key={questionCode}
          flexDirection="row"
          justifyContent="flex-start"
        >
          <Box
            marginBottom={5}
            justifyContent="space-between"
            width="100%"
          >
            <Box>
              <Text
                bold
                size="xs"
                color="grey"
              >
                {name}
              </Text>
            </Box>

            <Box
              alignItems="center"
            >
              {mandatory ? (
                <Text
                  size="xs"
                  color="grey"
                >
                  required
                  &nbsp;
                </Text>
              ) : null}

              {touched[questionCode]
                ? (
                  errors[questionCode]
                    ? (
                      <Icon
                        color="red"
                        name="clear"
                      />
                    ) : (
                      <Icon
                        color="green"
                        name="check"
                      />
                    )
                ) : (
                  <Icon
                    color="lightgrey"
                    name="check"
                  />
                )}
            </Box>
          </Box>
        </Box>

        <FormInput
          onChangeValue={this.handleChange( questionCode, setFieldValue, setTouched, ask )}
          value={values && values[questionCode]}
          type={typeof dataType === 'string' ? dataType.toLowerCase() : dataType}
          error={touched[questionCode] && errors[questionCode]}
          onBlur={this.handleBlur( ask, values, errors )}
          required={mandatory}
          question={question}
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
          flexShrink={0}
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
          (
            /* TODO: move this into its own function */
            this.props.baseEntities.attributes[ask.targetCode][ask.attributeCode].valueString ||
            this.props.baseEntities.attributes[ask.targetCode][ask.attributeCode].valueDate ||
            this.props.baseEntities.attributes[ask.targetCode][ask.attributeCode].valueBoolean
          )
      );
    });

    return (
      <Formik
        initialValues={initialValues}
        validate={this.doValidate}
        onSubmit={this.handleSubmit}
        validateOnBlur
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
            <KeyboardAwareScrollView>
              <Box
                flexDirection="column"
                flex={1}
                height="100%"
                width="100%"
                padding={20}
              >
                <Box
                  marginY={20}
                  width="100%"
                >
                  <Heading
                    align="center"
                    width="100%"
                    size="lg"
                  >
                    {questionGroup.name}
                  </Heading>
                </Box>

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
                  showSpinnerOnClick
                  key={questionGroup.name}
                >
                  Submit
                </Button>
              </Box>
            </KeyboardAwareScrollView>
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
