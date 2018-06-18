import React, { Component, cloneElement } from 'react';
import { node, object, string } from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import dlv from 'dlv';
import { Box, Button, Heading, KeyboardAwareScrollView, WebView } from '../../components';

class Payments extends Component {
  static propTypes = {
    children: node,
    initialValues: object,
    title: string,
    baseEntities: object,
    aliases: object,
  }

  state = {
    bankToken: null,
    deviceId: null,
  }

  componentDidMount() {
    this.getBankToken();
    this.getDeviceId();
  }

  componentDidUpdate() {
    if ( !this.state.bankToken ) {
      this.getBankToken();
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

  getBankToken() {
    const { aliases, baseEntities } = this.props;
    const userAlias = aliases.USER;

    const bankToken = dlv( baseEntities, `attributes.${userAlias}.PRI_ASSEMBLY_BANK_TOKEN.value` );

    if ( bankToken )
      this.setState({ bankToken });
  }

  handleMessage = message => {
    if ( !message.type )
      return;

    const { type, payload } = message;

    switch ( type ) {
      case 'CAPTURE_DEVICE_ID_SUCCESS': {
        this.setState({ deviceId: payload });

        break;
      }

      case 'CREATE_BANK_ACCOUNT_SUCCESS': {
        console.warn( 'success!', payload );

        break;
      }

      case 'CREATE_BANK_ACCOUNT_ERROR': {
        console.warn( 'fail!', payload );

        break;
      }

      default:
        break;
    }
  }

  handleSubmit = ( values, form ) => {
    const { setSubmitting } = form;
    const { bankToken } = this.state;

    setSubmitting( true );

    const data = {
      ...values,
      country: 'AUS',
      payout_currency: 'AUD',
    };

    console.warn({
      type: 'CREATE_BANK_ACCOUNT',
      payload: {
        token: bankToken,
        data,
      },
    });

    this.sendMessageToWebView({
      type: 'CREATE_BANK_ACCOUNT',
      payload: {
        token: bankToken,
        data,
      },
    });
  }

  sendMessageToWebView = message => {
    this.webview.postMessage( message );
  }

  render() {
    const { children, initialValues, title } = this.props;

    return (
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
              isValid,
              isSubmitting,
              handleSubmit,
              setFieldTouched,
              setFieldValue,
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

                {React.Children.map( children, child => (
                  cloneElement( child, {
                    props: {
                      ...child.props.props,
                      value: values && values[child.props.props.name],
                      error: errors && errors[child.props.props.name],
                      onChangeValue: value => {
                        console.warn({ value }, child.props.props.name );

                        setFieldValue( child.props.props.name, value );
                        setFieldTouched( child.props.props.name, true );
                      },
                    },
                  })
                ))}

                <Button
                  disabled={!isValid || isSubmitting}
                  color="green"
                  onPress={handleSubmit}
                  showSpinnerOnClick
                >
                  Submit
                </Button>
              </Box>
            )}
          </Formik>

          <WebView
            height={0}
            width={0}
            onMessage={this.handleMessage}
            ref={webview => this.webview = webview}
            source={require( './payments.html' )}
          />
        </Box>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = state => ({
  aliases: state.vertx.aliases,
  baseEntities: state.vertx.baseEntities,
});

export default connect( mapStateToProps )( Payments );
