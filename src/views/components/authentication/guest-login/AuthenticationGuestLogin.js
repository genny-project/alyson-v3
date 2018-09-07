import React, { Component } from 'react';
import { object, string, number } from 'prop-types';
import Config from '../../../../config';
import { withKeycloak, Redirect, ActivityIndicator, Timeout } from '../../index';
import store from '../../../../redux/store';

class AuthenticationGuestLogin extends Component {
  static defaultProps = {
    timeout: 60000,
    redirectFallback: 'home',
  }

  static propTypes = {
    keycloak: object,
    redirectTo: string.isRequired,
    redirectFallback: string,
    timeout: number,
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
    const { keycloak, redirectTo, redirectFallback, timeout } = this.props;
    const layouts = store.getState().vertx.layouts;

    if (
      keycloak.isAuthenticated &&
      layouts.pages
    ) {
      return (
        <Timeout
          duration={timeout}
          ref={timeout => ( this.timeout = timeout )}
        >
          {({ isTimeUp }) => (
            layouts.pages[redirectTo]
              ? (
                <Redirect
                  to={redirectTo}
                  removeRedirectURL
                  useMainNavigator
                  appTo={
                    redirectTo
                  }
                />
              )
              : isTimeUp
                ? (
                  <Redirect
                    to={redirectFallback}
                    removeRedirectURL
                    useMainNavigator
                    appTo={
                      redirectFallback
                    }
                  />
                )
                : (
                  <ActivityIndicator size="large" />
                )
          )}
        </Timeout>
      );
    }

    return (
      <ActivityIndicator size="large" />
    );
  }
}

export default withKeycloak( AuthenticationGuestLogin );
