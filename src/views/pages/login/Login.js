import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { object } from 'prop-types';
import { Text, Box, KeycloakConsumer, Redirect } from '../../components';
import Layout from '../../layout';

class Login extends Component {
  static propTypes = {
    keycloak: object,
    navigation: object,
  }

  componentDidMount() {
    this.doLogin();
  }

  doLogin = async () => {
    const { attemptLogin } = this.props.keycloak;

    const attempt = await attemptLogin({ replaceUrl: true });

    if ( attempt && attempt.type === 'cancel' )
      this.props.navigation.goBack();
  }

  render() {
    const { isAuthenticated, error } = this.props.keycloak;

    if ( isAuthenticated )
      return <Redirect to="app" />;

    if ( error )
      return <Text>An error has occurred!</Text>;

    return (
      <Layout
        title="Login"
        appColor="light"
      >
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
          flexDirection="column"
        >
          <ActivityIndicator />
          <Text>Logging you in...</Text>
        </Box>
      </Layout>
    );
  }
}

export default props => (
  <KeycloakConsumer>
    {keycloak => (
      <Login {...props} keycloak={keycloak} />
    )}
  </KeycloakConsumer>
);
