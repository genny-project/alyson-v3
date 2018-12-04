import React, { Component, Fragment, createElement } from 'react';
import { ActivityIndicator, View, Platform } from 'react-native';
import { string, object, oneOfType, array, bool } from 'prop-types';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import capitalize from 'lodash.capitalize';
import lowercase from 'lodash.lowercase';
import { isArray, isObject, isString } from '../../../utils';
import { Bridge } from '../../../utils/vertx';
import shallowCompare from '../../../utils/shallow-compare';
import { Box, Text, Button, KeyboardAwareScrollView, ScrollView } from '../index';
import Recursive from '../layout-loader/Recursive';
import FormInput from './input';
import { store } from '../../../redux';
import { hideDialog } from '../../../redux/actions';

const buttonTypes = ['NEXT', 'SUBMIT', 'CANCEL', 'NO', 'YES', 'ACCEPT', 'DECLINE'];

class Form extends Component {
  inputRefs = {}

  static defaultProps = {
    loadingText: 'Loading form...',
    testID: 'form',
    shouldSetInitialValues: true,
    formWrapperProps: {},
    alwaysActiveButtonTypes: [
      'CANCEL',
      'NO',
      'YES',
    ],
  }

  static propTypes = {
    questionGroupCode: oneOfType(
      [string, array]
    ),
    asks: object, // eslint-disable-line react/no-unused-prop-types
    baseEntities: object,
    renderHeading: object,
    renderSubheading: object,
    formWrapperProps: object,
    renderFormInput: object,
    renderFormInputWrapper: object,
    renderFormInputLabel: object,
    renderLoading: object,
    renderSubmitButtonWrapper: object,
    renderSubmitButton: object,
    displayInline: bool,
    hideButtonIfDisabled: bool,
    loadingText: string,
    testID: string,
    shouldSetInitialValues: bool,
    alwaysActiveButtonTypes: array,
  }

  state = {
    validationList: {},
    initialValues: {},
    questionGroups: [],
    formStatus: null,
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
        this.setState({ questionGroups: newGroups }, () => {
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
        this.setState({ questionGroups: newGroups }, () => {
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
        this.setState({ questionGroups: newGroups }, () => {
          if ( checkIfSetNeeded ) {
            this.setInitialValues();
            this.setValidationList();
          }
        });
      }
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

  renderButton( buttonProps ) {
    const { renderSubmitButton, renderSubmitButtonWrapper, hideButtonIfDisabled } = this.props;
    const { disabled } = buttonProps;

    if (
      hideButtonIfDisabled &&
      disabled
    ) {
      return null;
    }

    if ( renderSubmitButtonWrapper ) {
      return (
        <Recursive
          key={buttonProps.key}
          {...renderSubmitButtonWrapper}
          children={( // eslint-disable-line react/no-children-prop
            renderSubmitButton
              ? {
                ...renderSubmitButton,
                props: {
                  ...buttonProps,
                  ...renderSubmitButton.props,

                },
              }
              : {
                component: 'Button',
                props: buttonProps,
              }
          )}
        />
      );
    }

    return (
      <Box key={buttonProps.key}>
        {renderSubmitButton ? (
          <Recursive
            {...renderSubmitButton}
            props={{
              ...renderSubmitButton.props,
              ...buttonProps,
            }}
          />
        ) : (
          <Button {...buttonProps} />
        )}
      </Box>
    );
  }

  renderInput = (
    values,
    errors,
    touched,
    setFieldValue,
    setTouched,
    isSubmitting,
    questionGroupCode,
    submitCount,
    submitForm,
  ) => ( ask, index ) => {
    const {
      renderFormInput,
      renderFormInputWrapper,
      renderFormInputLabel,
      renderSubheading,
      baseEntities,
    } = this.props;

    const { questionCode, attributeCode, name, mandatory, question, childAsks } = ask;
    const baseEntityDefinition = baseEntities.definitions.data[attributeCode];
    const dataType = baseEntityDefinition && baseEntityDefinition.dataType;

    if ( isArray( childAsks, { ofMinLength: 1 })) {
      return (
        <Box
          flexDirection="column"
          position="relative"
          zIndex={100 - index}
        >
          {renderSubheading ? (
            <Recursive
              {...renderSubheading}
              key={name}
              context={{
                subheading: name,
              }}
            />
          ) : null}

          <Box flexDirection="column">
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

    const inputProps = {
      onChangeValue: this.handleChange( questionCode, setFieldValue, setTouched, ask ),
      value: values && values[questionCode],
      type: isString( dataType ) ? dataType.toLowerCase() : dataType,
      error: touched[questionCode] && errors[questionCode],
      onBlur: this.handleBlur( ask, values, errors ),
      required: mandatory,
      question,
      disabled: isSubmitting,
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
    };

    const context = {
      label: name,
      question,
      required: mandatory,
      touched: touched[questionCode],
      error: errors[questionCode],
      disabled: isSubmitting,
      submitCount,
    };

    const children = [];

    if ( renderFormInputLabel ) {
      children.push({
        ...renderFormInputLabel,
        context,
        props: {
          ...renderFormInputLabel.props,
          ...inputProps,
        },
      });
    }

    if ( renderFormInput ) {
      children.push({
        ...renderFormInput,
        context,
        props: {
          ...renderFormInput.props,
          ...inputProps,
        },
      });
    }
    else {
      children.push(
        <FormInput
          {...inputProps}
        />
      );
    }

    return (
      <Recursive
        key={questionCode}
        context={context}
        /* Default to the 'Box' component if `renderFormInputWrapper` is
         * not given as a prop. */
        component="Box"
        {...renderFormInputWrapper}
        props={{
          position: 'relative',
          zIndex: 50 - index,
          ...renderFormInputWrapper ? renderFormInputWrapper.props : {},
        }}
        children={children} // eslint-disable-line react/no-children-prop
      />
    );
  }

  render() {
    const {
      questionGroupCode,
      renderHeading,
      renderLoading,
      displayInline,
      loadingText,
      testID,
      formWrapperProps,
      alwaysActiveButtonTypes,
    } = this.props;
    const { questionGroups } = this.state;

    if (
      !isArray( questionGroups, { ofMinLength: 1 }) ||
      (
        isArray( questionGroupCode ) &&
        questionGroupCode.length !== questionGroups.length
      )
    ) {
      if ( renderLoading ) {
        return <Recursive {...renderLoading} />;
      }

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
    const WrapperComponent = displayInline ? ScrollView : KeyboardAwareScrollView;

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
            <WrapperComponent
              testID={testID}
              scrollEnabled={!displayInline}
              style={{
                width: '100%',
              }}
            >
              {createElement( Platform.OS === 'web' ? 'form' : View, {
                style: {
                  flexDirection: displayInline ? 'row' : 'column',
                  width: '100%',
                  flex: 1,
                  ...formWrapperProps,
                },
                onSubmit: handleSubmit,
              }, (
                <Fragment>
                  {questionGroups.map(( questionGroup, index ) => (
                    <Box
                      flexDirection={displayInline ? 'row' : 'column'}
                      zIndex={150 - index}
                      position="relative"
                      flex={1}
                      key={questionGroup.name}
                    >
                      {renderHeading ? (
                        <Recursive
                          {...renderHeading}
                          key={questionGroup.name}
                          context={{
                            heading:
                              questionGroup.childAsks.length === 1 &&
                              questionGroup.childAsks[0].question.attribute.dataType.typeName === 'java.lang.Boolean'
                                ? questionGroup.childAsks[0].question.name
                                : questionGroup.name,
                          }}
                        />
                      ) : null}

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
                              submitCount,
                              submitForm,
                            )
                          )
                        )
                      }
                    </Box>
                  ))}

                  {questionGroups.reduce(( buttons, { attributeCode }) => {
                    buttonTypes.forEach( type => {
                      if ( attributeCode.includes( type )) {
                        buttons.push(
                          this.renderButton({
                            disabled: (
                              !isFormValid &&
                              !alwaysActiveButtonTypes.includes( type )
                            ) || isSubmitting,
                            onPress: () => {
                              // when clicked on cancel button on the form => close the Popup
                              buttons && buttons.map( button => {
                                if ( button.key === 'CANCEL' )
                                  store.dispatch( hideDialog({ layoutName: `questions/${questionGroupCode}` }));
                              }
                              );
                              this.setState({
                                formStatus: lowercase( type ),
                              }, () => {
                                submitForm();
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
                </Fragment>
                ))}
            </WrapperComponent>
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
