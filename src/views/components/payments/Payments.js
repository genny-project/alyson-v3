import React, { Component, cloneElement, Fragment } from 'react';
import { StyleSheet, Modal } from 'react-native';
import { node, object, string, oneOf } from 'prop-types';
import { connect } from 'react-redux';
import { BlurView } from 'expo';
import { Formik } from 'formik';
import capitalize from 'lodash.capitalize';
import dlv from 'dlv';
import { Bridge } from '../../../utils';
import { Box, Button, Heading, KeyboardAwareScrollView, WebView, Text, Icon, alert } from '../../components';

class Payments extends Component {
  static propTypes = {
    children: node,
    initialValues: object,
    title: string,
    baseEntities: object,
    aliases: object,
    type: oneOf(
      ['bank', 'card']
    ),
  }

  bankFields = {
    account_nickname: {
      validation: {
        regex: /.+/g,
        error: 'Please enter this field',
      },
    },
    account_name: {
      validation: {
        regex: /(\w|\s)+/g,
        error: 'Please only enter letters and spaces',
      },
    },
    account_number: {
      validation: {
        regex: /(\w|\d)+/g,
        error: 'Please only enter letters and numbers',
      },
    },
    account_type: {
      validation: {
        regex: /(checking|savings)+/g,
        error: 'Please enter this field',
      },
    },
    routing_number: {
      validation: {
        regex: /\d{6}/g,
        error: 'Please enter 6 numbers with no spaces or dashes',
      },
    },
    bank_name: {
      validation: {
        regex: /.+/g,
        error: 'Please enter this field',
      },
    },
    holder_type: {
      validation: {
        regex: /(personal|business)/g,
        error: 'Please enter this field',
      },
    },
  }

  cardFields = {
    full_name: {
      validation: {
        regex: /(\w|\s)+/g,
        error: 'Please enter only letters and spaces',
      },
    },
    number: {
      validation: {
        regex: /\d+/g,
        error: 'Please enter only numbers with no spaces or dashes',
      },
    },
    cvv: {
      validation: {
        regex: /\d+/g,
        error: 'Please enter only numbers',
      },
    },
    expiry_month: {
      validation: {
        regex: /\d{2}/g,
        error: 'Please enter a month number with 2 digits (e.g. 05)',
      },
    },
    expiry_year: {
      validation: {
        regex: /\d{4}/g,
        error: `Please enter only a full year (e.g. ${new Date().getFullYear()})`,
      },
    },
  }

  state = {
    bankToken: null,
    cardToken: null,
    deviceId: null,
    miscErrors: [],
    isSubmitting: false,
    isSubmitted: false,
  }

  componentDidMount() {
    this.getBankToken();
    this.getCardToken();
    this.getDeviceId();
  }

  componentDidUpdate() {
    if ( !this.state.bankToken ) {
      this.getBankToken();
    }

    if ( !this.state.cardToken ) {
      this.getCardToken();
    }

    if ( !this.state.deviceId ) {
      this.getDeviceId();
    }
  }

  getDeviceId() {
    this.sendMessageToWebView({
      type: 'CAPTURE_DEVICE_ID',
    });
  }

  getCardToken() {
    const { aliases, baseEntities } = this.props;
    const userAlias = aliases.USER;

    const cardToken = dlv( baseEntities, `attributes.${userAlias}.PRI_ASSEMBLY_CARD_TOKEN.value` );

    if ( cardToken )
      this.setState({ cardToken });
  }

  getBankToken() {
    const { aliases, baseEntities } = this.props;
    const userAlias = aliases.USER;

    const bankToken = dlv( baseEntities, `attributes.${userAlias}.PRI_ASSEMBLY_BANK_TOKEN.value` );

    if ( bankToken )
      this.setState({ bankToken });
  }

  handleMessage = form => message => {
    if ( !message || !message.type )
      return;

    const { setErrors, values } = form;
    const { type, payload } = message;

    switch ( type ) {
      case 'CAPTURE_DEVICE_ID_SUCCESS': {
        this.setState({ deviceId: payload });

        break;
      }

      case 'CREATE_CARD_ACCOUNT_SUCCESS': {
        console.warn( 'success!', payload );

        this.setState({
          isSubmitted: true,
          isSubmitting: false,
        });

        this.sendNewPaymentMethodToBridge({
          type: 'CARD',
          id: payload.id,
          name: values.full_name,
          number: values.number,
          nickname: values.nickname,
        });

        break;
      }

      case 'CREATE_BANK_ACCOUNT_SUCCESS': {
        console.warn( 'success!', payload );

        this.setState({
          isSubmitted: true,
          isSubmitting: false,
        });

        this.sendNewPaymentMethodToBridge({
          type: 'BANK_ACCOUNT',
          id: payload.id,
          name: values.account_name,
          bsb: values.routing_number,
          nickname: values.account_nickname,
          accountNumber: values.account_number,
        });

        break;
      }

      case 'CREATE_CARD_ACCOUNT_ERROR':
      case 'CREATE_BANK_ACCOUNT_ERROR': {
        this.setState({
          isSubmitting: false,
        });

        const miscErrors = [];
        const errors = (
          Object
            .keys( payload.responseJSON.errors )
            .reduce(( errors, field ) => {
              const formattedError = capitalize(
                `${field} ${payload.responseJSON.errors[field][0]}`
              );

              if ( values[field] )
                errors[field] = formattedError;
              else
                miscErrors.push( formattedError );

              return errors;
            }, {})
        );

        const errorValues = Object.values( errors );
        const totalErrors = miscErrors.length + errorValues.length;

        alert({
          title: 'Uh oh!',
          message: `${totalErrors} error${totalErrors > 1 ? 's' : ''} occurred:\n${errorValues.concat( miscErrors ).join( '\n' )}`,
        });

        this.setState({ miscErrors });
        setErrors( errors );

        break;
      }

      default:
        break;
    }
  }

  handleSubmit = values => {
    const { type } = this.props;
    const { bankToken, cardToken } = this.state;

    this.setState({
      isSubmitting: true,
    });

    const token = type === 'bank'
      ? bankToken
      : cardToken;

    const data = {
      ...values,
      ...( type === 'bank' ) && {
        country: 'AUS',
        payout_currency: 'AUD',
      },
    };

    this.sendMessageToWebView({
      type: type === 'bank'
        ? 'CREATE_BANK_ACCOUNT'
        : 'CREATE_CARD_ACCOUNT',
      payload: {
        token,
        data,
      },
    });
  }

  doValidate = values => {
    if ( !values )
      return {};

    const { type } = this.props;
    const errors = {};
    const fields = type === 'bank'
      ? this.bankFields
      : this.cardFields;

    Object.keys( values ).forEach( field => {
      if ( !fields[field] ) {
        errors[field] = 'Please enter this field';
      }
      else {
        const value = values[field];
        const { validation } = fields[field];

        if ( validation ) {
          let valid = true;

          if ( validation.regex )
            valid = new RegExp( validation.regex ).test( value );

          if ( !valid )
            errors[field] = validation.error || 'Please enter this field';
        }
      }
    });

    return errors;
  }

  sendMessageToWebView = message => {
    this.webview.postMessage( message );
  }

  sendNewPaymentMethodToBridge( data ) {
    Bridge.sendButtonEvent( 'PAYMENT_SUBMIT', {
      code: 'USER_ADD_NEW_PAYMENT_METHOD',
      value: JSON.stringify( data ),
    });
  }

  render() {
    const { children, initialValues, title, type } = this.props;
    const { miscErrors, isSubmitting, isSubmitted } = this.state;

    return (
      <Fragment>
        <KeyboardAwareScrollView>
          <Box
            height="100%"
            width="100%"
            flex={1}
            flexDirection="column"
            padding={20}
          >
            <Formik
              initialValues={initialValues}
              onSubmit={this.handleSubmit}
              validate={this.doValidate}
              validateOnChange
            >
              {({
                values,
                errors,
                touched,
                handleSubmit,
                setFieldTouched,
                setFieldValue,
                setErrors,
              }) => (
                <Box
                  flexDirection="column"
                >
                  <Box
                    marginY={20}
                    justifyContent="center"
                  >
                    <Heading
                      align="center"
                      size="lg"
                    >
                      {title}
                    </Heading>
                  </Box>

                  {miscErrors.length > 0 ? (
                    <Box
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      paddingY={15}
                      marginTop={10}
                      marginBottom={20}
                      backgroundColor="red"
                    >
                      <Box
                        paddingY={5}
                        justifyContent="center"
                      >
                        <Text
                          color="white"
                          bold
                          align="center"
                          size="xs"
                        >
                          {miscErrors.length}
                          {' '}
                          error
                          {miscErrors.length > 1 ? 's' : ''}
                          {' '}
                          occurred:
                        </Text>
                      </Box>

                      {miscErrors.map( error => (
                        <Box
                          key={error}
                          paddingY={5}
                          justifyContent="center"
                        >
                          <Text
                            color="white"
                            bold
                            align="center"
                            size="xs"
                          >
                            {error}
                          </Text>
                        </Box>
                      ))}
                    </Box>
                  ) : null}

                  {React.Children.map( children, child => (
                    cloneElement( child, {
                      props: {
                        ...child.props.props,
                        value: values && values[child.props.props.name],
                        valid: (
                          touched[child.props.props.name] &&
                          (
                            !errors ||
                            !errors[child.props.props.name]
                          )
                        ),
                        error: (
                          touched[child.props.props.name] &&
                          errors &&
                          errors[child.props.props.name]
                        ),
                        onChangeValue: value => {
                          setFieldValue( child.props.props.name, value );
                          setFieldTouched( child.props.props.name, true );
                        },
                      },
                    })
                  ))}

                  <Button
                    disabled={isSubmitting}
                    color="green"
                    onPress={handleSubmit}
                    submitting={isSubmitting}
                  >
                    Submit
                  </Button>

                  <WebView
                    height={0}
                    width={0}
                    onMessage={this.handleMessage({
                      setErrors,
                      values,
                    })}
                    ref={webview => this.webview = webview}
                    source={require( './payments.html' )}
                  />
                </Box>
              )}
            </Formik>
          </Box>
        </KeyboardAwareScrollView>

        <Modal
          visible={isSubmitted}
          animationType="fade"
          transparent
        >
          <BlurView
            tint="default"
            style={StyleSheet.absoluteFill}
          >
            <Box
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              flex={1}
            >
              <Icon
                size="xxl"
                color="green"
                name="check"
              />

              <Box paddingY={20}>
                <Text
                  size="md"
                  align="center"
                  bold
                >
                  {type === 'bank'
                    ? 'Bank account created!'
                    : 'Card added!'
                  }
                </Text>
              </Box>

              <Box paddingY={10}>
                <Text
                  size="xs"
                  align="center"
                >
                  Please wait while we redirect you...
                </Text>
              </Box>
            </Box>
          </BlurView>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  aliases: state.vertx.aliases,
  baseEntities: state.vertx.baseEntities,
});

export default connect( mapStateToProps )( Payments );
