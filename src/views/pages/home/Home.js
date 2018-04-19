import React, { Component, Fragment } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { Text, Button, Link, Box, KeycloakConsumer } from '../../components';
import Layout from '../../layout';
import * as page from '../../../utils/page';

class Home extends Component {
  state = {
    isRefreshing: false,
  }

  handleRefresh = () => {
    page.refresh();
  }

  render() {
    const { isRefreshing } = this.state;

    return (
      <KeycloakConsumer>
        {({ isAuthenticated, accessToken, refreshToken, isFetchingToken, user }) => (
          <Layout title="Home">
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={this.handleRefresh}
                />
              }
            >
              <Box>
                <Text>Home</Text>

                {isAuthenticated ? (
                  <Link to="logout">
                    <Button color="red">
                      Logout
                    </Button>
                  </Link>
                ) : (
                  <Fragment>
                    <Link to="login">
                      <Button color="green">
                        Login
                      </Button>
                    </Link>

                    <Link to="register">
                      <Button color="white">
                        Register
                      </Button>
                    </Link>
                  </Fragment>
                )}

                {isFetchingToken ? (
                  <Text>Fetching token...</Text>
                ) : (
                  <Fragment>
                    <Text>{accessToken ? accessToken.substr( -20 ) : 'No access token'}</Text>
                    <Text>{refreshToken ? refreshToken.substr( -20 ) : 'No refresh token'}</Text>

                    {user && (
                      <Fragment>
                        <Text>{user.fullName}</Text>
                        <Text>{user.email}</Text>
                      </Fragment>
                    )}
                  </Fragment>
                )}
              </Box>
            </ScrollView>
          </Layout>
        )}
      </KeycloakConsumer>
    );
  }
}

export default Home;
