import React, { Component, cloneElement, Fragment } from 'react';
import { StyleSheet, Modal } from 'react-native';
import { node, object, string } from 'prop-types';
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
  }

  state = {
    token: null,
    deviceId: null,
    miscErrors: [],
    isSubmitting: false,
    isSubmitted: false,
  }

  componentDidMount() {
    this.getToken();
    this.getDeviceId();
  }

  componentDidUpdate() {
    if ( !this.state.token ) {
      this.getToken();
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

  getToken() {
    const { aliases, baseEntities } = this.props;
    const userAlias = aliases.USER;

    const token = dlv( baseEntities, `attributes.${userAlias}.PRI_ASSEMBLY_BANK_TOKEN.value` );

    if ( token )
      this.setState({ token });
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

      case 'CREATE_BANK_ACCOUNT_SUCCESS': {
        console.warn( 'success!', payload );

        this.setState({
          isSubmitted: true,
          isSubmitting: false,
        });

        break;
      }

      case 'CREATE_BANK_ACCOUNT_ERROR': {
        this.setState({
          isSubmitting: false,
        });

        const miscErrors = [];
        const formattedErrors = [];
        const errors = (
          Object
            .keys( payload.responseJSON.errors )
            .reduce(( errors, field ) => {
              if ( values[field] ) {
                errors[field] = payload.responseJSON.errors[field][0];

                formattedErrors.push(
                  capitalize( `${field} ${payload.responseJSON.errors[field][0]}!` )
                );
              }
              else {
                miscErrors.push(
                  capitalize( `${field} ${payload.responseJSON.errors[field][0]}!` )
                );
              }

              return errors;
            }, {})
        );

        const totalErrors = miscErrors.length + formattedErrors.length;

        alert({
          title: 'Uh oh!',
          message: `${totalErrors} error${totalErrors > 1 ? 's' : ''} occurred:\n${formattedErrors.concat( miscErrors ).join( '\n' )}`,
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
    const { token } = this.state;

    this.setState({
      isSubmitting: true,
    });

    const data = {
      ...values,
      country: 'AUS',
      payout_currency: 'AUD',
    };

    this.sendMessageToWebView({
      type: 'CREATE_BANK_ACCOUNT',
      payload: {
        token,
        data,
      },
    });
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
    const { children, initialValues, title } = this.props;
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
            >
              {({
                values,
                errors,
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
                        error: (
                          errors &&
                          errors[child.props.props.name] &&
                          `${child.props.props.label} ${errors[child.props.props.name]}`
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
                  Bank account created!
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
