import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { object } from 'prop-types';
import { Text, Box, KeycloakConsumer, Redirect } from '../../components';
import Layout from '../../layout';

class Register extends Component {
  static propTypes = {
    keycloak: object,
  }

  state = {
    browserDismissed: false,
  }

  componentDidMount() {
    this.doRegister();
  }

  doRegister = async () => {
    const { attemptRegister } = this.props.keycloak;

    const attempt = await attemptRegister({ replaceUrl: true });

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

export default props => (
  <KeycloakConsumer>
    {keycloak => (
      <Register
        {...props}
        keycloak={keycloak}
      />
    )}
  </KeycloakConsumer>
);
