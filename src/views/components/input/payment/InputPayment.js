import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { object, func } from 'prop-types';
import { connect } from 'react-redux';
import { isArray, assemblyHtmlBridge } from '../../../../utils';
import { Box, Touchable, Text, WebView, LinkButton } from '../../../components';

class InputPayment extends Component {
  static propTypes = {
    user: object,
    onChangeValue: func,
  }

  state = {
    paymentMethods: [],
    selected: null,
    ipAddress: null,
    deviceId: null,
  }

  componentDidMount() {
    this.getPaymentMethods();
    this.getIpAddress();
    this.getDeviceId();
  }

  componentDidUpdate() {
    if ( !this.state.deviceId ) {
      this.getDeviceId();
    }
  }

  async getIpAddress() {
    const response = await fetch( 'https://api.ipify.org?format=json' );
    const { ip } = await response.json();

    this.setState({ ipAddress: ip });
  }

  getPaymentMethods() {
    const { attributes } = this.props.user;
    const userPaymentMethods = attributes.PRI_USER_PAYMENT_METHODS;

    if (
      userPaymentMethods &&
      isArray( userPaymentMethods.value, { ofMinLength: 1 })
    ) {
      this.setState({ paymentMethods: userPaymentMethods.value });
    }
  }

  getDeviceId() {
    this.webview.postMessage({
      type: 'CAPTURE_DEVICE_ID',
    });
  }

  handlePress = id => () => {
    this.setState({ selected: id });

    if ( this.props.onChangeValue ) {
      const { ipAddress, deviceId } = this.state;

      const data = {
        accountID: id,
        deviceID: deviceId,
        ipAddress,
      };

      this.props.onChangeValue( data );
    }
  }

  handleMessage = message => {
    if ( !message || !message.type )
      return;

    const { type, payload } = message;

    switch ( type ) {
      case 'CAPTURE_DEVICE_ID_SUCCESS': {
        this.setState({ deviceId: payload });

        break;
      }

      default:
        break;
    }
  }

  render() {
    const { paymentMethods, selected, deviceId } = this.state;

    return (
      <Box
        flexDirection="column"
        justifyContent="center"
      >
        {!deviceId ? (
          <Box
            marginTop={10}
            marginBottom={10}
            alignItems="center"
          >
            <Box marginRight={5}>
              <ActivityIndicator size="small" />
            </Box>

            <Text color="grey">
              Capturing device ID, please wait...
            </Text>
          </Box>
        ) : null}

        {paymentMethods.map( method => (
          <Touchable
            withFeedback
            onPress={this.handlePress( method.id )}
            key={method.id}
            disabled={!deviceId}
            style={{
              width: '100%',
              maxWidth: 400,
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <Box
              paddingY={30}
              paddingX={20}
              borderRadius={10}
              borderWidth={2}
              borderColor={selected ? 'green' : '#DDD'}
              borderStyle="solid"
              justifyContent="space-between"
              marginX="auto"
            >
              <Box flexDirection="column">
                <Box marginBottom={10}>
                  <Text>
                    {method.nickname}
                  </Text>
                </Box>

                <Box marginBottom={10}>
                  <Text>
                    {method.type === 'BANK_ACCOUNT'
                      ? `BSB: ${method.bsb}`
                      : method.name}
                  </Text>
                </Box>

                <Text>
                  {method.type === 'BANK_ACCOUNT'
                    ? `Acc#: ${method.accountNumber}`
                    : method.number}
                </Text>
              </Box>
            </Box>
          </Touchable>
        ))}

        <Box
          marginTop={10}
        >
          <LinkButton
            text="Add payment method"
            to="payment/accounts/add"
            color="black"
            size="md"
          />
        </Box>

        <WebView
          height={0}
          width={0}
          onMessage={this.handleMessage}
          ref={webview => this.webview = webview}
          source={assemblyHtmlBridge}
        />
      </Box>
    );
  }
}

const mapStateToProps = state => ({
  user: state.vertx.user,
});

export default connect( mapStateToProps )( InputPayment );
