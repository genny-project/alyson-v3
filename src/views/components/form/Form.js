import React, { Component, Fragment } from 'react';
import { ActivityIndicator } from 'react-native';
import { string, object, oneOfType, array } from 'prop-types';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { isArray, isObject, isString } from '../../../utils';
import { Bridge } from '../../../utils/vertx';
import { Box, Text, Button, Heading, Icon, KeyboardAwareScrollView } from '../index';
import FormInput from './input';

class Form extends Component {
  static propTypes = {
    questionGroupCode: oneOfType(
      [string, array]
    ),
    asks: object, // eslint-disable-line react/no-unused-prop-types
    baseEntities: object,
  }

  inputRefs = {}

  state = {
    validationList: {},
    initialValues: {},
    questionGroups: [],
  }

  componentDidMount() {
    this.setInitialValues();
    this.setValidationList();
  }

  componentDidUpdate( prevProps, prevState ) {
    const { questionGroupCode } = this.props;
    const { questionGroups } = this.state;

    if (
      isString( questionGroupCode ) &&
      isArray( questionGroups, { ofExactLength: 0 })
    ) {
      const newGroups = this.getQuestionGroups();

      if ( newGroups.length > 0 ) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ questionGroups: newGroups });
      }
    }

    else if (
      isArray( questionGroupCode ) &&
      questionGroupCode.length !== questionGroups.length
    ) {
      const newGroups = this.getQuestionGroups();
      const prevGroups = this.getQuestionGroups( prevProps );

      if ( newGroups.length !== prevGroups.length ) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ questionGroups: newGroups });
      }
    }

    if ( this.state.questionGroups.length !== prevState.questionGroups.length ) {
      this.setInitialValues();
      this.setValidationList();
    }
  }

  setInitialValues = () => {
    const { questionGroups } = this.state;
    const { attributes } = this.props.baseEntities;

    if ( !isArray( questionGroups, { ofMinLength: 1 })) {
      return;
    }

    const initialValues = {};

    questionGroups.forEach( questionGroup => {
      if ( !isArray( questionGroup.childAsks, { ofMinLength: 1 }))
        return;

      questionGroup.childAsks.forEach( ask => {
        if ( isArray( ask.childAsks, { ofMinLength: 1 })) {
          ask.childAsks.forEach( childAsk => {
            const value = (
              attributes[childAsk.targetCode] &&
              attributes[childAsk.targetCode][childAsk.attributeCode] &&
              attributes[childAsk.targetCode][childAsk.attributeCode].value
            );

            /* TODO: better handle `false` value */
            if ( value || childAsk.mandatory )
              initialValues[childAsk.questionCode] = value || null;
          });
        }

        else {
          const value = (
            attributes[ask.targetCode] &&
            attributes[ask.targetCode][ask.attributeCode] &&
            attributes[ask.targetCode][ask.attributeCode].value
          );

          /* TODO: better handle `false` value */
          if ( value || ask.mandatory )
            initialValues[ask.questionCode] = value || null;
        }
      });
    });

    if ( Object.keys( initialValues ).length > 0 )
      this.setState({ initialValues });
  }

  setValidationList() {
    const { questionGroups } = this.state;
    const { data } = this.props.baseEntities.definitions;

    if ( !isArray( questionGroups, { ofMinLength: 1 })) {
      this.setState({ validationList: {} });

      return;
    }

    const validationList = {};

    questionGroups.forEach( questionGroup => {
      if ( !isArray( questionGroup.childAsks, { ofMinLength: 1 })) {
        return;
      }

      questionGroup.childAsks.forEach( ask => {
        const dataType = (
          data[ask.attributeCode] &&
          data[ask.attributeCode].dataType
        );

        validationList[ask.questionCode] = {
          dataType,
          required: ask.mandatory,
        };
      });
    });

    this.setState({ validationList });
  }

  /* Default to using `this.props`, allowing for `prevProps` to be
   * passed to this fn inside of `componentDidUpdate`. */
  getQuestionGroups( props = this.props ) {
    const { questionGroupCode, asks } = props;

    /* questionGroupCode here is an array, so loop through the keys and
     * push the ask to the array if it exists. */
    if ( questionGroupCode instanceof Array ) {
      return questionGroupCode.reduce(( questionGroups, code ) => {
        if ( asks[code] )
          questionGroups.push( asks[code] );

        return questionGroups;
      }, [] );
    }

    /* questionGroupCode from here is a string, so check if the ask exists
     * for this questionGroupCode key. If exists, return it inside of an array. */
    if ( asks[questionGroupCode] ) {
      return [
        asks[questionGroupCode],
      ];
    }

    /* If nothing works, return an empty array. */
    return [];
  }

  doValidate = values => {
    if ( !values )
      return {};

    const { validationList } = this.state;
    const { types } = this.props.baseEntities.definitions;
    const newState = {};

    Object.keys( values ).forEach( field => {
      const validationData = validationList[field];

      if ( !validationData ) {
        return;
      }

      const { dataType, required } = validationData;
      const validationArray = types[dataType] && types[dataType].validationList;

      if ( !isArray( validationArray, { ofMinLength: 1 })) {
        return;
      }

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

    if ( ask.attributeCode.indexOf( 'ADDRESS_FULL' ) !== -1 ) {
      finalAttributeCode = ask.attributeCode.replace( 'ADDRESS_FULL', 'ADDRESS_JSON' );
    }
    else if ( ask.attributeCode.indexOf( 'PRI_RATING' ) !== -1 ) {
      finalAttributeCode = 'PRI_RATING_RAW';
    }

    /* If the form is an object or an array, stringify it. */
    if (
      isObject( finalValue ) ||
      isArray( finalValue )
    ) {
      finalValue = JSON.stringify( finalValue );
    }

    console.warn( 'sending answer...', {
      askId: ask.id,
      attributeCode: finalAttributeCode,
      sourceCode: ask.sourceCode,
      targetCode: ask.targetCode,
      code: ask.questionCode,
      questionGroup: this.getQuestionGroups().name,
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
      questionGroup: this.getQuestionGroups().name,
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

  handleFocusNextInput = ( questionGroupCode, currentFocusedIndex ) => () => {
    if (
      this.inputRefs[questionGroupCode] &&
      this.inputRefs[questionGroupCode][currentFocusedIndex + 1] &&
      this.inputRefs[questionGroupCode][currentFocusedIndex + 1].focus
    ) {
      this.inputRefs[questionGroupCode][currentFocusedIndex + 1].focus();
    }
  }

  handleSubmit = ( values, form ) => {
    const { setSubmitting } = form;
    const { questionGroups } = this.state;

    setSubmitting( true );

    const questionGroup = questionGroups.find( group => {
      return group.attributeCode.includes( 'BUTTON' );
    }) || (
      questionGroups.length > 0 &&
      questionGroups[0]
    );

    if ( !questionGroup ) {
      console.warn( 'Could not submit form - no question group associated with form.' );

      return;
    }

    /* send event to back end */
    const eventData = {
      code: questionGroup.questionCode,
      value: JSON.stringify({
        targetCode: questionGroup.targetCode,
        action: 'submit',
      }),
    };

    Bridge.sendButtonEvent( 'FORM_SUBMIT', eventData );
  }

  handlePressNo = () => {
    const { questionGroups } = this.state;

    const questionGroup = questionGroups.find( group => {
      return group.attributeCode.includes( 'BUTTON' );
    }) || (
      questionGroups.length > 0 &&
      questionGroups[0]
    );

    if ( !questionGroup ) {
      console.warn( 'Could not submit form - no question group associated with form.' );

      return;
    }

    /* send event to back end */
    const eventData = {
      code: questionGroup.questionCode,
      value: JSON.stringify({
        targetCode: questionGroup.targetCode,
        action: 'no',
      }),
    };

    Bridge.sendButtonEvent( 'FORM_SUBMIT', eventData );
  }

  handlePressYes = () => {
    const { questionGroups } = this.state;

    const questionGroup = questionGroups.find( group => {
      return group.attributeCode.includes( 'BUTTON' );
    }) || (
      questionGroups.length > 0 &&
      questionGroups[0]
    );

    if ( !questionGroup ) {
      console.warn( 'Could not submit form - no question group associated with form.' );

      return;
    }

    /* send event to back end */
    const eventData = {
      code: questionGroup.questionCode,
      value: JSON.stringify({
        targetCode: questionGroup.targetCode,
        action: 'yes',
      }),
    };

    Bridge.sendButtonEvent( 'FORM_SUBMIT', eventData );
  }

  handleBlur = ( ask, values, errors ) => () => {
    if ( ask ) {
      const questionCode = ask.questionCode;

      if (
        questionCode &&
        values &&
        values[questionCode] &&
        (
          !errors ||
          !errors[questionCode]
        )
      ) {
        this.sendAnswer( ask, values[questionCode] );
      }
    }
  }

  renderInput = (
    values,
    errors,
    touched,
    setFieldValue,
    setTouched,
    isSubmitting,
    questionGroupCode
  ) => ( ask, index ) => {
    const { definitions } = this.props.baseEntities;
    const { questionCode, attributeCode, name, mandatory, question, childAsks } = ask;
    const { dataType } = definitions.data[attributeCode];

    if ( isArray( childAsks, { ofMinLength: 1 })) {
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
              this.renderInput(
                values,
                errors,
                touched,
                setFieldValue,
                setTouched,
                false,
                ask.questionCode
              )
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
          disabled={isSubmitting}
          onSubmitEditing={this.handleFocusNextInput( questionGroupCode, index )}
          blurOnSubmit={(
            !this.inputRefs[questionGroupCode] ||
            !this.inputRefs[questionGroupCode][index + 1]
          )}
          ref={input => this.inputRefs[questionGroupCode] = {
            ...this.inputRefs[questionGroupCode],
            [index]: input,
          }}
          returnKeyType={(
            this.inputRefs[questionGroupCode] &&
            this.inputRefs[questionGroupCode][index + 1]
          )
            ? 'next'
            : 'default'}
        />
      </Box>
    );
  }

  render() {
    const { questionGroupCode } = this.props;
    const { questionGroups } = this.state;

    if (
      !isArray( questionGroups, { ofMinLength: 1 }) ||
      (
        isArray( questionGroupCode ) &&
        questionGroupCode.length !== questionGroups.length
      )
    ) {
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
                {questionGroups.map( questionGroup => (
                  <Fragment key={questionGroup.name}>
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

                    {(
                      /* If there is only one child ask and it's a Boolean question,
                       * don't show it - the 'YES'/'NO' buttons underneath this will suffice. */
                      questionGroup.childAsks.length === 1 &&
                      questionGroup.childAsks[0].question.attribute.dataType.typeName === 'java.lang.Boolean'
                    )
                      ? null
                      : (
                        questionGroup.childAsks.map(
                          this.renderInput(
                            values,
                            errors,
                            touched,
                            setFieldValue,
                            setFieldTouched,
                            isSubmitting,
                            questionGroup.questionCode,
                            questionGroup.childAsks.length - 1
                          )
                        )
                      )
                    }
                  </Fragment>
                ))}

                {questionGroups.reduce(( buttons, { attributeCode }) => {
                  if ( attributeCode.includes( 'YES' )) {
                    buttons.push(
                      <Box marginTop={10}>
                        <Button
                          color="green"
                          onPress={this.handlePressYes}
                          showSpinnerOnClick
                          key="YES"
                        >
                          Yes
                        </Button>
                      </Box>
                    );
                  }

                  if ( attributeCode.includes( 'NO' )) {
                    buttons.push(
                      <Box marginTop={10}>
                        <Button
                          color="green"
                          onPress={this.handlePressNo}
                          showSpinnerOnClick
                          key="NO"
                        >
                          No
                        </Button>
                      </Box>
                    );
                  }

                  if ( attributeCode.includes( 'SUBMIT' )) {
                    buttons.push(
                      <Box marginTop={10}>
                        <Button
                          disabled={!isValid || isSubmitting}
                          color="green"
                          onPress={handleSubmit}
                          showSpinnerOnClick
                          key="YES"
                        >
                          Submit
                        </Button>
                      </Box>
                    );
                  }

                  return buttons;
                }, [] )}
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
