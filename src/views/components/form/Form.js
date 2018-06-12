import React, { Component, Fragment } from 'react';
import { ActivityIndicator } from 'react-native';
import { string, object, oneOfType, array } from 'prop-types';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { Bridge } from '../../../utils/vertx';
import { Box, Text, Button, Heading, Icon, KeyboardAwareScrollView } from '../index';
import FormInput from './input';

class Form extends Component {
  static propTypes = {
    questionGroupCode: oneOfType(
      [string, array]
    ),
    asks: object,
    baseEntities: object,
  }

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
      (
        typeof questionGroupCode === 'string' &&
        questionGroups.length === 0
      ) ||
      (
        questionGroupCode instanceof Array &&
        questionGroupCode.length !== questionGroups.length
      )
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

    if (
      !questionGroups ||
      !questionGroups.length
    ) {
      return;
    }

    const initialValues = {};

    questionGroups.forEach( questionGroup => {
      if (
        !questionGroup.childAsks ||
        !( questionGroup.childAsks instanceof Array ) ||
        questionGroup.childAsks.length === 0
      )
        return;

      questionGroup.childAsks.forEach( ask => {
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

            /* TODO: better handle `false` value */
            if ( value || childAsk.mandatory )
              initialValues[childAsk.questionCode] = value || null;
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

    if (
      !questionGroups ||
      !questionGroups.length
    ) {
      this.setState({ validationList: {} });

      return;
    }

    const validationList = {};

    questionGroups.forEach( questionGroup => {
      if (
        !questionGroup.childAsks ||
        !( questionGroup.childAsks instanceof Array ) ||
        questionGroup.childAsks.length === 0
      )
        return;

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

  /* UNUSED function - kept for reference in future for form recursive functions  */
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

    if ( ask.attributeCode.indexOf( 'ADDRESS_FULL' ) !== -1 ) {
      finalAttributeCode = ask.attributeCode.replace( 'ADDRESS_FULL', 'ADDRESS_JSON' );
      finalValue = JSON.stringify( finalValue );
    }

    else if ( ask.attributeCode.indexOf( 'PRI_RATING' ) !== -1 ) {
      finalAttributeCode = 'PRI_RATING_RAW';
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

  renderInput = ( values, errors, touched, setFieldValue, setTouched, isSubmitting ) => ask => {
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
          disabled={isSubmitting}
        />
      </Box>
    );
  }

  render() {
    const { questionGroupCode } = this.props;
    const { questionGroups } = this.state;

    if (
      !questionGroups ||
      !questionGroups.length ||
      (
        questionGroupCode instanceof Array &&
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

                    {questionGroup.childAsks.map(
                      this.renderInput(
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        setFieldTouched,
                        isSubmitting
                      )
                    )}
                  </Fragment>
                ))}

                <Button
                  disabled={!isValid || isSubmitting}
                  color="green"
                  onPress={handleSubmit}
                  showSpinnerOnClick
                  key={questionGroups[0].name}
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
