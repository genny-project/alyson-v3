import React, { Component } from 'react';
import { object, string } from 'prop-types';
import Config from '../../../../config';
import { withKeycloak, Redirect, ActivityIndicator } from '../../index';
import store from '../../../../redux/store';

class AuthenticationGuestLogin extends Component {
  static propTypes = {
    keycloak: object,
    redirectTo: string.isRequired,
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
    const layouts = store.getState().vertx.layouts;

    if (
      keycloak.isAuthenticated &&
      layouts.pages[redirectTo]
    ) {
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
