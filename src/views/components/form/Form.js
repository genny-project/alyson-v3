import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { string, object } from 'prop-types';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { Bridge } from '../../../utils/vertx';
import { Box, Text, Button, Heading, Icon, KeyboardAwareScrollView } from '../index';
import FormInput from './input';

class Form extends Component {
  static propTypes = {
    questionGroupCode: string,
    asks: object,
    baseEntities: object,
  }

  state = {
    validationList: {},
    initialValues: {},
  }

  componentDidMount() {
    this.setInitialValues();
    this.setValidationList();
  }

  componentDidCatch( error ) {
    console.warn( error );
  }

  setInitialValues() {
    const questionGroup = this.getQuestionGroup();
    const { attributes } = this.props.baseEntities;

    if (
      !questionGroup ||
      !questionGroup.childAsks
    ) {
      this.setState({ initialValues: {} });

      return;
    }

    const initialValues = questionGroup.childAsks.reduce(( initialValues, ask ) => {
      if (
        ask.childAsks &&
        ask.childAsks instanceof Array &&
        ask.childAsks.length > 0
      ) {
        ask.childAsks.forEach( childAsk => {
          const value = (
            attributes[childAsk.targetCode] &&
            attributes[childAsk.targetCode][childAsk.attributeCode] &&
            (
              attributes[childAsk.targetCode][childAsk.attributeCode].valueString ||
              attributes[childAsk.targetCode][childAsk.attributeCode].valueDate ||
              attributes[childAsk.targetCode][childAsk.attributeCode].valueBoolean
            )
          );

          console.warn( 'childAsk', { childAsk, value }, ask.mandatory );

          /* TODO: better handle `false` value */
          if ( value || childAsk.mandatory )
            initialValues[childAsk.questionCode] = value;
        });
      }

      else {
        const value = (
          attributes[ask.targetCode] &&
          attributes[ask.targetCode][ask.attributeCode] &&
          (
            attributes[ask.targetCode][ask.attributeCode].valueString ||
            attributes[ask.targetCode][ask.attributeCode].valueDate ||
            attributes[ask.targetCode][ask.attributeCode].valueBoolean
          )
        );

        console.warn( 'regular', { ask, value }, ask.mandatory );

        /* TODO: better handle `false` value */
        if ( value || ask.mandatory )
          initialValues[ask.questionCode] = value;
      }

      return initialValues;
    }, {});

    console.warn({ initialValues });

    this.setState({ initialValues });
  }

  setValidationList() {
    const questionGroup = this.getQuestionGroup();
    const { data } = this.props.baseEntities.definitions;

    if (
      !questionGroup ||
      !questionGroup.childAsks
    ) {
      this.setState({ validationList: {} });

      return;
    }

    const validationList = questionGroup.childAsks.reduce(( validationList, ask ) => {
      const dataType = (
        data[ask.attributeCode] &&
        data[ask.attributeCode].dataType
      );

      validationList[ask.questionCode] = {
        dataType,
        required: ask.mandatory,
      };

      return validationList;
    }, {});

    this.setState({ validationList });
  }

  getQuestionGroup() {
    const { questionGroupCode, asks } = this.props;

    return asks[questionGroupCode];
  }

  findAsk = field => {
    const { questionGroupCode, asks } = this.props;
    const questionGroup = asks[questionGroupCode];

    let ask = null;

    const deepSearch = array => array.forEach( element => {
      console.warn({ element });

      if ( element.questionCode === field )
        ask = element;

      else if ( element.childAsks )
        deepSearch( element.childAsks );
    });

    deepSearch( questionGroup.childAsks );

    return ask;
  }

  doValidate = values => {
    if ( !values )
      return {};

    const { validationList } = this.state;
    const { types } = this.props.baseEntities.definitions;
    const newState = {};

    Object.keys( values ).forEach( field => {
      const validationData = validationList[field];

      if ( !validationData )
        return;

      const { dataType, required } = validationData;
      const validationArray = types[dataType] && types[dataType].validationList;

      if (
        !validationArray ||
        !( validationArray instanceof Array ) ||
        validationArray.length === 0
      )
        return;

      if (
        values[field] == null &&
        required
      ) {
        newState[field] = 'Please enter this field';
      }

      const isValid = validationArray.every( validation => {
        return new RegExp( validation.regex ).test( String( values[field] ));
      });

      if ( !isValid )
        newState[field] = 'Error';
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
            {childAsks.map(
              this.renderInput( values, errors, touched, setFieldValue, setTouched )
            )}
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

    const { initialValues } = this.state;

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
