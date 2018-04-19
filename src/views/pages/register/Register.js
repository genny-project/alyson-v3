import React, { Component } from 'react';
import { object } from 'prop-types';
import { Text, Box, KeycloakConsumer, Redirect } from '../../components';
import Layout from '../../layout';

class Register extends Component {
  static propTypes = {
    keycloak: object,
  }

  state = {
    cancelledAttempt: false,
  }

  componentDidMount() {
    this.doRegister();
  }

  doRegister = async () => {
    const { attemptRegister } = this.props.keycloak;

    const attempt = await attemptRegister({ replaceUrl: true });

    if ( attempt && attempt.type === 'cancel' )
      this.setState({ cancelledAttempt: true });
  }

  render() {
    const { isAuthenticated, error } = this.props.keycloak;
    const { cancelledAttempt } = this.state;

    if ( isAuthenticated || cancelledAttempt )
      return <Redirect to="home" />;

    if ( error )
      return <Text>{error}</Text>;

    return (
      <Layout title="Register">
        <Box justifyContent="center" alignItems="center" height="100%">
          <Text>Preparing to register...</Text>
        </Box>
      </Layout>
    );
  }
}

export default props => (
  <KeycloakConsumer>
    {keycloak => (
      <Register {...props} keycloak={keycloak} />
    )}
  </KeycloakConsumer>
);
