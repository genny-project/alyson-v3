import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { object } from 'prop-types';
import { Text, Box, KeycloakConsumer, Redirect } from '../../components';
import Layout from '../../layout';

class Login extends Component {
  static propTypes = {
    keycloak: object,
  }

  state = {
    browserDismissed: false,
  }

  componentDidMount() {
    if ( !this.props.keycloak.isAuthenticated && !this.props.keycloak.isCheckingStorage )
      this.doLogin();
  }

  componentDidUpdate() {
    if (
      !this.props.keycloak.isAuthenticated &&
      !this.props.keycloak.isCheckingStorage &&
      !this.props.keycloak.isAuthenticating
    )
      this.doLogin();
  }

  doLogin = async () => {
    const { attemptLogin } = this.props.keycloak;

    const attempt = await attemptLogin({ replaceUrl: true });

    if ( attempt && attempt.type === 'cancel' )
      this.setState({ browserDismissed: true });
  }

  render() {
    const { isAuthenticated, error } = this.props.keycloak;
    const { browserDismissed } = this.state;

    if ( isAuthenticated )
      return <Redirect to="app" />;

    if ( browserDismissed )
      return <Redirect to="splash" />;

    if ( error )
      return (
        <Text>
          An error has occurred!
        </Text>
      );

    return (
      <Layout
        title="Login"
        appColor="light"
        hideHeader
      >
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
          flexDirection="column"
          testID="page-login"
        >
          <ActivityIndicator
            size="large"
          />

          <Box
            height={20}
          />

          <Text>
            Logging you in...
          </Text>
        </Box>
      </Layout>
    );
  }
}

export default props => (
  <KeycloakConsumer>
    {keycloak => (
      <Login
        {...props}
        keycloak={keycloak}
      />
    )}
  </KeycloakConsumer>
);
