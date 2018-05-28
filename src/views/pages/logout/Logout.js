import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { object } from 'prop-types';
import { Text, Box, KeycloakConsumer, Redirect } from '../../components';
import Layout from '../../layout';

class Logout extends Component {
  static propTypes = {
    keycloak: object,
  }

  state = {
    browserDismissed: false,
  }

  componentDidMount() {
    this.doLogout();
  }

  doLogout = async () => {
    const { attemptLogout } = this.props.keycloak;

    const attempt = await attemptLogout({ replaceUrl: true });

    if ( attempt && attempt.type === 'cancel' )
      this.setState({ browserDismissed: true });
  }

  render() {
    const { isAuthenticated, error } = this.props.keycloak;
    const { browserDismissed } = this.state;

    if ( !isAuthenticated )
      return <Redirect to="auth" />;

    if ( browserDismissed )
      return <Redirect to="auth" />;

    if ( error )
      return (
        <Text>
          An error has occurred!
        </Text>
      );

    return (
      <Layout
        title="Logout"
        appColor="light"
        hideHeader
      >
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
          flexDirection="column"
        >
          <ActivityIndicator
            size="large"
          />

          <Box
            height={20}
          />

          <Text>
            Logging you out...
          </Text>
        </Box>
      </Layout>
    );
  }
}

export default props => (
  <KeycloakConsumer>
    {keycloak => (
      <Logout {...props} keycloak={keycloak} />
    )}
  </KeycloakConsumer>
);
