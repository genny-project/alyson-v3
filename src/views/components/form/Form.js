import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { string, object, oneOfType, array, bool } from 'prop-types';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import dlv from 'dlv';
import { isArray, isObject, isString } from '../../../utils';
import { Bridge } from '../../../utils/vertx';
import shallowCompare from '../../../utils/shallow-compare';
import { Box, Text, Button, KeyboardAwareScrollView, Fragment, Collapsible } from '../index';
import FormInput from './input';

class Form extends Component {
  static defaultProps = {
    loadingText: 'Loading form...',
    testID: 'form',
    shouldSetInitialValues: true,
    alwaysActiveButtonTypes: [
      'CANCEL',
      'NO',
      'YES',
    ],
    inheritedThemes: {},
  }

  static propTypes = {
    questionGroupCode: oneOfType(
      [string, array]
    ),
    asks: object, // eslint-disable-line react/no-unused-prop-types
    baseEntities: object,
    hideButtonIfDisabled: bool,
    loadingText: string,
    testID: string,
    shouldSetInitialValues: bool,
    alwaysActiveButtonTypes: array,
    inheritedThemes: object,
  }

  inputRefs = {}

  state = {
    validationList: {},
    initialValues: {},
    questionGroups: [],
    formStatus: null,
    missingBaseEntities: [],
  }

  componentDidMount() {
    this.setInitialValues();
    this.setValidationList();
  }

  componentDidUpdate( prevProps, prevState ) {
    const { questionGroupCode } = this.props;
    const { questionGroups } = this.state;

    const checkIfSetNeeded = () => {
      return (
        this.state.questionGroups.length !== prevState.questionGroups.length ||
        questionGroupCode !== prevProps.questionGroupCode
      );
    };

    if (
      isString( questionGroupCode ) &&
      questionGroupCode !== prevProps.questionGroupCode
    ) {
      const newGroups = this.getQuestionGroups();

      if ( newGroups.length > 0 ) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ questionGroups: newGroups, missingBaseEntities: [] }, () => {
          if ( checkIfSetNeeded ) {
            this.setInitialValues();
            this.setValidationList();
          }
        });
      }
    }

    else if (
      isString( questionGroupCode ) &&
      isArray( questionGroups, { ofExactLength: 0 })
    ) {
      const newGroups = this.getQuestionGroups();

      if ( newGroups.length > 0 ) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ questionGroups: newGroups, missingBaseEntities: [] }, () => {
          if ( checkIfSetNeeded ) {
            this.setInitialValues();
            this.setValidationList();
          }
        });
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
        this.setState({ questionGroups: newGroups, missingBaseEntities: [] }, () => {
          if ( checkIfSetNeeded ) {
            this.setInitialValues();
            this.setValidationList();
          }
        });
      }
    }

    else if (
      isArray( this.state.missingBaseEntities, { ofMinLength: 1 })
    ) {
      if (
        this.checkIfNewBaseEntities( this.props )
      ) {
        this.setInitialValues();
        this.setValidationList();
      }
    }
  }

  setInitialValues = () => {
    const { questionGroups } = this.state;
    const { attributes } = this.props.baseEntities;

    if ( !isArray( questionGroups, { ofMinLength: 1 })) {
      return;
    }

    const checkForBE = ( code ) => {
      const beAttributes = dlv( attributes, `${code}` );

      if (
        !isObject( beAttributes, { isNotEmpty: true }) &&
        !this.state.missingBaseEntities.includes( code )
      ) {
        this.setState( state => ({
          missingBaseEntities: state.missingBaseEntities.includes( code )
            ? [...state.missingBaseEntities]
            : [...state.missingBaseEntities, code],
        }));
      }
      else if (
        isObject( beAttributes, { isNotEmpty: true }) &&
        this.state.missingBaseEntities.includes( code )
      ) {
        this.setState( state => ({
          missingBaseEntities: state.missingBaseEntities.filter( beCode => beCode !== code ),
        }));
      }
    };

    const initialValues = {};

    questionGroups.forEach( questionGroup => {
      if ( !isArray( questionGroup.childAsks, { ofMinLength: 1 }))
        return;

      questionGroup.childAsks.forEach( ask => {
        if ( isArray( ask.childAsks, { ofMinLength: 1 })) {
          ask.childAsks.forEach( childAsk => {
            checkForBE( childAsk.targetCode );

            const value = dlv( attributes, `${childAsk.targetCode}.${childAsk.attributeCode}.value` );

            /* TODO: better handle `false` value */
            if ( value || childAsk.mandatory ) {
              initialValues[childAsk.questionCode] = value || null;
            }
          });
        }

        else {
          checkForBE( ask.targetCode );

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

    if ( Object.keys( initialValues ).length > 0 && this.props.shouldSetInitialValues )
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

  checkIfNewBaseEntities = ( newProps ) => {
    const { missingBaseEntities } = this.state;

    const result = missingBaseEntities.some( beCode => {
      return (
        dlv( newProps, `baseEntities.data.${beCode}` ) &&
        isObject( dlv( newProps, `baseEntities.attributes.${beCode}` ), { isNotEmpty: true })
      );
    });

    return result;
  }

  doValidate = values => {
    console.log( 'do validate' );
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
        isArray( Object.keys( values ), { ofExactLength: 1 }) &&
        types[dataType] &&
        types[dataType].typeName === 'java.lang.Boolean'
      ) {
        return {};
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

    // eslint-disable-next-line no-console
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

    // console.log({ field, setFieldValue, setFieldTouched, ask, value, sendOnChange });

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
    console.log( 'handle submit' );
    if ( form ) {
      const { setSubmitting } = form;

      setSubmitting( true );
    }

    const { questionGroups, formStatus } = this.state;

    const questionGroup = questionGroups.find( group => {
      return group.attributeCode.includes( 'BUTTON' );
    }) || (
      questionGroups.length > 0 &&
      questionGroups[0]
    );

    if ( !questionGroup ) {
      // eslint-disable-next-line no-console
      console.warn( 'Could not submit form - no question group associated with form.' );

      return;
    }

    /* send event to back end */
    const eventData = {
      code: questionGroup.questionCode,
      value: JSON.stringify({
        targetCode: questionGroup.targetCode,
        action: formStatus || 'submit',
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

  handleKeyPress = ( submitForm, index, questionGroupCode ) => ( e ) => {
    const key = e.key;
    const formLength = (
      this.inputRefs[questionGroupCode] &&
      Object.keys( this.inputRefs[questionGroupCode] ).length
    );

    switch ( key ) {
      case 'Enter':
        if ( formLength === index + 1 ) {
          submitForm();
        }
        break;
      default:
        return null;
    }
  }

  renderInput = (
    ask,
    questionGroupCode,
    index,
    form,
  ) => {
    const {
      baseEntities,
    } = this.props;

    // console.log( 'renderInput', ask );
    const {
      values,
      errors,
      touched,
      setFieldValue,
      setFieldTouched,
      isSubmitting,
      submitCount,
      submitForm,
      isFormValid,

    } = form;
    const { questionCode, attributeCode, mandatory, question, contextList, readonly } = ask;
    const baseEntityDefinition = baseEntities.definitions.data[attributeCode];
    const dataType = baseEntityDefinition && baseEntityDefinition.dataType;

    const isFormSubmit = isObject( contextList, { withProperty: 'isFormSubmit' }) ? contextList.isFormSubmit : false;

    const inputProps = {
      onChangeValue: this.handleChange( questionCode, setFieldValue, setFieldTouched, ask ),
      value: values && values[questionCode],
      type: isString( dataType ) ? dataType.toLowerCase() : dataType,
      error: touched[questionCode] && errors[questionCode],
      onBlur: this.handleBlur( ask, values, errors ),
      required: mandatory,
      question,
      disabled: isFormSubmit
        ? !isFormValid
        : isSubmitting,
      editable: !readonly,
      onSubmitEditing: this.handleFocusNextInput( questionGroupCode, index ),
      blurOnSubmit: (
        !this.inputRefs[questionGroupCode] ||
        !this.inputRefs[questionGroupCode][index + 1]
      ),
      ref: input => this.inputRefs[questionGroupCode] = {
        ...this.inputRefs[questionGroupCode],
        [index]: input,
      },
      returnKeyType: (
        this.inputRefs[questionGroupCode] &&
        this.inputRefs[questionGroupCode][index + 1]
      )
        ? 'next'
        : 'default',
      onKeyPress: this.handleKeyPress( submitForm, index, questionGroupCode ),
      onPress: () => {
        console.log( 'onPress' );
        submitForm();
      },
      testID: questionCode || '',
      ...contextList,
      rootQuestionGroupCode: this.props.questionGroupCode,
      ...this.props.inheritedThemes,
    };

    return (
      <FormInput
        key={questionCode}
        {...inputProps}
      />
    );
  }

  renderQuestionGroup = ( questionGroup, index, form, ) => {
    const {
      name,
      childAsks,
      question,
      contextList,
      questionCode,
    } = questionGroup;

    const isDropdown = isObject( contextList, { withProperty: 'isDropdown' }) ? contextList.isDropdown : false;

    if ( isDropdown && question ) {
      return (
        <Collapsible
          renderHeader={
            this.renderInput(
              questionGroup,
              questionCode,
              index,
              form,
            )
          }
          headerIconProps={{
            ...this.props.inheritedThemes,
          }}
        >
          <Box
            flexDirection="column"
            zIndex={150 - index}
            position="relative"
            flex={1}
            key={name}
            {...this.props.inheritedThemes}
          >
            {childAsks.map(( ask, index ) => {
              if ( isArray( ask.childAsks, { ofMinLength: 1 })) {
                return this.renderQuestionGroup(
                  ask,
                  index,
                  form
                );
              }

              return this.renderInput(
                ask,
                questionCode,
                index,
                form,
              );
            })}
          </Box>
        </Collapsible>
      );
    }

    return (
      <Fragment>
        {question
          ? (
            this.renderInput(
              questionGroup,
              questionCode,
              index,
              form,
            )) : null
        }
        <Box
          flexDirection="column"
          zIndex={150 - index}
          position="relative"
          flex={1}
          key={name}
          // backgroundColor="rgba(255, 0, 0, 0.1)"
          // paddingLeft={5}
          {...this.props.inheritedThemes}
        >
          {childAsks.map(( ask, index ) => {
            if ( isArray( ask.childAsks, { ofMinLength: 1 })) {
              return this.renderQuestionGroup(
                ask,
                index,
                form
              );
            }

            return this.renderInput(
              ask,
              questionCode,
              index,
              form,
            );
          })}
        </Box>
      </Fragment>
    );
  }

  render() {
    const {
      questionGroupCode,
      loadingText,
      testID,
    } = this.props;
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
          testID={testID}
        >
          <ActivityIndicator size="large" />
          {
            loadingText != null &&
            isString( loadingText )
              ? (
                <Box
                  marginTop={10}
                >
                  <Text
                    align="center"
                  >
                    {loadingText}
                  </Text>
                </Box>
              )
              : null
          }
        </Box>
      );
    }

    const { initialValues } = this.state;

    return (
      <Formik
        initialValues={initialValues}
        validate={( values ) => this.doValidate( values )}
        onSubmit={this.handleSubmit}
        validateOnBlur
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          submitForm,
          submitCount,
          isSubmitting,
          setFieldValue,
          setFieldTouched,
          handleSubmit,
        }) => {
          const isFormValid = shallowCompare( this.doValidate( values ), {});

          return (
            <KeyboardAwareScrollView
              testID={testID}
            >
              <Box
                // accessibilityRole="form"
                flexDirection="column"
                flex={1}
                width="100%"
                onSubmit={handleSubmit}
                // backgroundColor="white"
              >
                <Fragment>
                  {questionGroups.map(( questionGroup, index ) => {
                    // const isSingleBooleanForm = (
                    //   questionGroup.childAsks.length === 1 &&
                    //   questionGroup.childAsks[0].question.attribute.dataType.typeName === 'java.lang.Boolean'
                    // );

                    // map over the root question groups

                    return this.renderQuestionGroup(
                      questionGroup,
                      index,
                      {
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        setFieldTouched,
                        isSubmitting,
                        submitCount,
                        submitForm,
                        isFormValid,
                      }
                    );
                  })}

                  {/* TODO: remove button rendering, move code to handle form submit somewhere else, as prop passed to children? */}

                  {/*
                  {questionGroups.reduce(( buttons, { childAsks, attributeCode }) => {
                    buttonTypes.forEach( type => {
                      if ( attributeCode.includes( type )) {
                        buttons.push(
                          this.renderButton({
                            disabled: (
                              !(
                                questionGroups.length === 1 &&
                                  isArray( childAsks, { ofMinLength: 1 }) &&
                                  childAsks[0].question.attribute.dataType.typeName === 'java.lang.Boolean'
                              ) &&
                                !isFormValid &&
                                !alwaysActiveButtonTypes.includes( type )
                            ),
                            onPress: () => {
                                // when clicked on cancel button on the form => close the Popup
                              buttons && buttons.map( button => {
                                if ( button.key === 'CANCEL' ) {
                                  store.dispatch(
                                    hideDialog({ layoutName: `questions/${questionGroupCode}` })
                                  );
                                }
                              });

                              this.setState({
                                formStatus: lowercase( type ),
                              }, () => {
                                if ( type === 'CANCEL' ) {
                                    // Skip the validation from occurring in Formik
                                    // * and go straight to form submission.
                                  this.handleSubmit();
                                }
                                else {
                                  submitForm();
                                }
                              });
                            },
                            key: type,
                            text: capitalize( type ),
                            showSpinnerOnClick: true,
                          })
                        );
                      }
                    });

                    return buttons;
                  }, [] )}

                  */}
                </Fragment>
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
