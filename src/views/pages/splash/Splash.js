import React, { Component } from 'react';
import { Link, Button, Box } from '../../components';
import Layout from '../../layout';

class Splash extends Component {
  static navigationOptions = {
    title: 'Splash',
    drawerLabel: 'Splash',
  }

  render() {
    return (
      <Layout
        title="Splash"
        appColor="light"
        hideHeader
      >
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
          flexDirection="column"
        >
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
        </Box>
      </Layout>
    );
  }
}

export default Splash;
