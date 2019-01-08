import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import { Text, Box, KeycloakConsumer, Redirect } from '../../components';
import Layout from '../../layout';
import Generic from '../generic';

class Register extends Component {
  static propTypes = {
    keycloak: object,
    config: object,
  }

  state = {
    browserDismissed: false,
  }

  componentDidMount() {
    if (
      this.shouldDoRegister()
    ) {
      this.doRegister();
    }
  }

  componentDidUpdate() {
    if (
      this.shouldDoRegister()
    ) {
      this.doRegister();
    }
  }

  shouldDoRegister = () => {
    const { keycloak } = this.props;
    const { config } = this.props;

    return (
      !keycloak.isAuthenticated &&
      !keycloak.isCheckingStorage &&
      !keycloak.isAuthenticating &&
      config !== null &&
      config.ENV_USE_CUSTOM_AUTH_LAYOUTS !== 'TRUE' &&
      config.ENV_USE_CUSTOM_AUTH_LAYOUTS !== 'true'
    );
  }

  doRegister = async () => {
    const { attemptRegister } = this.props.keycloak;

    const attempt = await attemptRegister({ replaceUrl: true });

    if ( attempt && attempt.type === 'cancel' ) {
      this.setState({ browserDismissed: true });
    }
  }

  render() {
    const { isAuthenticated, error } = this.props.keycloak;
    const { config } = this.props;
    const { browserDismissed } = this.state;

    if (
      config &&
      (
        config.ENV_USE_CUSTOM_AUTH_LAYOUTS === 'TRUE' ||
        config.ENV_USE_CUSTOM_AUTH_LAYOUTS === 'true'
      )
    ) {
      return <Generic layout="register" />;
    }

    if ( isAuthenticated )
      return <Redirect to="app" />;

    if ( browserDismissed )
      return <Redirect to="splash" />;

    if ( error )
      return (
        <Text>
          {error}
        </Text>
      );

    return (
      <Layout
        title="Register"
        appColor="light"
        hideHeader
      >
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
          flexDirection="column"
          testID="page-register"
        >
          <ActivityIndicator
            size="large"
          />

          <Box
            height={20}
          />

          <Text>
            Preparing to register...
          </Text>
        </Box>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  config: state.keycloak.data,
});

export default connect( mapStateToProps )( props => (
  <KeycloakConsumer>
    {keycloak => (
      <Register
        {...props}
        keycloak={keycloak}
      />
    )}
  </KeycloakConsumer>
));
