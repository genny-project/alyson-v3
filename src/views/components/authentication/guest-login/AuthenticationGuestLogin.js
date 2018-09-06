import React, { Component } from 'react';
import { object, string } from 'prop-types';
import Config from '../../../../config';
import { withKeycloak, Redirect, ActivityIndicator } from '../../index';

class AuthenticationGuestLogin extends Component {
  static propTypes = {
    keycloak: object,
    redirectTo: string,
  }

  componentDidMount() {
    const username = Config.guest.username;
    const password = Config.guest.password;

    if (
      username != null &&
      password != null
    ) {
      this.handleLogin(
        {
          username: username,
          password: password,
        }
      );
    }
  }

  handleLogin = async ( values ) => {
    const { keycloak } = this.props;

    try {
      await keycloak.doLoginWithApi( values );
    }
    catch ( error ) {
      console.log( error );
    }
  }

  render() {
    const { keycloak, redirectTo } = this.props;

    if ( keycloak.isAuthenticated && redirectTo ) {
      return (
        <Redirect
          to={redirectTo}
          removeRedirectURL
          useMainNavigator
          appTo={
            redirectTo
          }
        />
      );
    }

    return (
      <ActivityIndicator size="large" />
    );
  }
}

export default withKeycloak( AuthenticationGuestLogin );
