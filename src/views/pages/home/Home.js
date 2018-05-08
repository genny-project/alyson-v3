import React, { Component, Fragment } from 'react';
import { object } from 'prop-types';
import { Text, Button, Link, Box, KeycloakConsumer } from '../../components';
import Layout from '../../layout';

class Home extends Component {
  static propTypes = {
    keycloak: object,
  }

  static navigationOptions = {
    title: 'Home',
    drawerLabel: 'Home',
  }

  render() {
    const { isFetchingToken, accessToken, refreshToken, user } = this.props.keycloak;

    return (
      <Layout
        title="Home"
        appColor="dark"
      >
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          flex={1}
          height="100%"
        >
          <Text>Home</Text>

          <Link to="profile/:id">
            <Button color="blue">
              Generic page
            </Button>
          </Link>

          <Link to="logout">
            <Button color="red">
              Logout
            </Button>
          </Link>

          <Text>{accessToken ? accessToken.substr( -20 ) : 'No access token'}</Text>
          <Text>{refreshToken ? refreshToken.substr( -20 ) : 'No refresh token'}</Text>

          {user && (
            <Fragment>
              <Text>{user.fullName}</Text>
              <Text>{user.email}</Text>
            </Fragment>
          )}

          {isFetchingToken && (
            <Text>Fetching token...</Text>
          )}
        </Box>
      </Layout>
    );
  }
}

export default props => (
  <KeycloakConsumer>
    {keycloak => (
      <Home {...props} keycloak={keycloak} />
    )}
  </KeycloakConsumer>
);
