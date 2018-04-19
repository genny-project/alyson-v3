import React, { Component, Fragment } from 'react';
import { Text, Button, Link, Box, KeycloakConsumer } from '../../components';
import Layout from '../../layout';

class Home extends Component {
  render() {
    return (
      <KeycloakConsumer>
        {({ isAuthenticated, accessToken, refreshToken, isFetchingToken, user }) => (
          <Layout>
            <Box>
              <Text>Home</Text>

              {isAuthenticated ? (
                <Link to="logout">
                  <Button>
                    Logout
                  </Button>
                </Link>
              ) : (
                <Fragment>
                  <Link to="login">
                    <Button>
                      Login
                    </Button>
                  </Link>

                  <Link to="register">
                    <Button>
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
          </Layout>
        )}
      </KeycloakConsumer>
    );
  }
}

export default Home;
