import React, { Component, Fragment } from 'react';
import { object } from 'prop-types';
import { Text, Button, Link, Box, KeycloakConsumer, ScrollView } from '../../components';
import Layout from '../../layout';
import * as page from '../../../utils/page';

class Home extends Component {
  static propTypes = {
    keycloak: object,
  }

  static navigationOptions = {
    title: 'Home',
    drawerLabel: 'Home',
  }

  state = {
    isRefreshing: false,
  }

  handleRefresh = () => {
    page.refresh();
  }

  render() {
    const { isFetchingToken, accessToken, refreshToken, user } = this.props.keycloak;
    const { isRefreshing } = this.state;

    return (
      <Layout title="Home">
        <ScrollView
          enableRefresh
          onRefresh={this.handleRefresh}
          isRefreshing={isRefreshing}
          flex={1}
        >
          <Box>
            <Text>Home</Text>

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
        </ScrollView>
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
