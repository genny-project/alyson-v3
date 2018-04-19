import React, { Component } from 'react';
import { Platform } from 'react-native';
import { string, any } from 'prop-types';
import queryString from 'query-string';
import uuid from 'uuid/v4';
import KeycloakContext from '../context';
import { Url, Storage } from '../../../../utils';
import * as keycloakUtils from '../../../../utils/keycloak';

class KeycloakProvider extends Component {
  static propTypes = {
    realm: string.isRequired,
    clientId: string.isRequired,
    baseUrl: string.isRequired,
    children: any,
  }

  /* eslint-disable react/sort-comp */
  attemptLogin = ( options = {}) => {
    if ( this.state.isAuthenticated ) return;

    const {
      replaceUrl = false,
    } = options;

    const LoginUrl = this.createLoginUrl();

    this.setState({
      isAuthenticating: true,
      error: null,
      browserSession: LoginUrl,
    });

    return new Promise( async ( resolve, reject ) => {
      await this.setState({ promise: { resolve, reject } });

      const session = await LoginUrl
        .addEventListener( 'url', this.handleUrlChange )
        .open({ replaceUrl });

      resolve( session );
    });
  }

  attemptRegister = ( options = {}) => {
    if ( this.state.isAuthenticated ) return;

    const {
      replaceUrl = false,
    } = options;

    const RegisterUrl = this.createRegisterUrl();

    this.setState({
      isRegistering: true,
      error: null,
      browserSession: RegisterUrl,
    });

    return new Promise( async ( resolve, reject ) => {
      await this.setState({ promise: { resolve, reject } });

      const session = await RegisterUrl
        .addEventListener( 'url', this.handleUrlChange )
        .open({ replaceUrl });

      resolve( session );
    });
  }

  attemptLogout = async ( options = {}) => {
    if ( !this.state.isAuthenticated ) return;

    const {
      replaceUrl = false,
    } = options;

    if ( this.state.refreshTimer )
      clearInterval( this.state.refreshTimer );

    /* Make sure to wait for each of these functions to finish. */
    await Promise.all( [
      Storage.remove( 'kcSessionState' ),
      Storage.remove( 'kcSessionNonce' ),
      Storage.remove( 'kcAuth' ),
      this.asyncSetState({
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        sessionState: null,
        sessionNonce: null,
        error: null,
        user: {},
      }),
    ] );

    const LogoutUrl = this.createLogoutUrl();

    LogoutUrl
      .addEventListener( 'url', this.handleUrlChange )
      .open({ replaceUrl });

    return new Promise(( resolve, reject ) => {
      this.setState({ promise: { resolve, reject } });
    });
  }
  /* eslint-enable react/sort-comp */

  state = {
    isAuthenticated: false,
    isAuthenticating: false,
    isRegistering: false,
    accessToken: null,
    refreshToken: null,
    refreshTimer: null,
    sessionState: null,
    sessionNonce: null,
    error: null,
    user: {},
    isFetchingToken: false,
    attemptLogin: this.attemptLogin,
    attemptRegister: this.attemptRegister,
    attemptLogout: this.attemptLogout,
  }

  componentDidMount = () => {
    this.checkForExistingState();
    this.checkForCallback();
  }

  componentWillUnmount() {
    if ( this.state.refreshTimer )
      clearInterval( this.state.refreshTimer );
  }

  asyncSetState = state => {
    return new Promise( resolve => this.setState( state, resolve ));
  }

  checkForExistingState = async () => {
    try {
      const session = await Storage.getAndParse( 'kcAuth' );

      if ( !session )
        return;

      const {
        state,
        nonce,
        accessToken,
        refreshToken,
        accessTokenExpiresOn,
        refreshTokenExpiresOn,
      } = session;

      const accessTokenHasExpired = this.hasTokenExpired( accessTokenExpiresOn );
      const refreshTokenHasExpired = this.hasTokenExpired( refreshTokenExpiresOn );

      if ( !refreshTokenHasExpired ) {
        await this.asyncSetState({
          sessionState: state,
          sessionNonce: nonce,
          accessToken: accessTokenHasExpired ? null : accessToken,
          refreshToken,
          isAuthenticated: true,
        });

        this.startTokenRefresh();
      }

      if ( this.state.resolve )
        this.state.resolve();
    }
    catch ( e ) {
      /* We don't care if there is an error. */
    }
  }

  checkForCallback = async () => {
    /* Only perform this on the web. */
    if ( Platform.OS !== 'web' ) return;

    const sessionState = await Storage.get( 'kcSessionState' );
    const { state, code, ...restQuery } = queryString.parse( location.search );
    const numberOfRestQueries = restQuery ? Object.keys( restQuery ).length : 0;

    if ( !sessionState ) return;
    if ( !state ) return;
    if ( !code ) return;

    /* Remove `state` and `code` from the URL query params. */
    let newUrl = location.pathname;

    if ( numberOfRestQueries.length > 0 )
      newUrl += `?${queryString.stringify( restQuery )}`;

    history.replaceState({}, null, newUrl );

    /* Ensure the sessions are aligned. */
    if ( sessionState === state )
      this.handleAuthSuccess( code );
  }

  createRealmUrl() {
    const { baseUrl, realm } = this.props;
    const encodedRealm = encodeURIComponent( realm );

    return `${baseUrl}/auth/realms/${encodedRealm}`;
  }

  createActionUrl = ( action, query = {}) => {
    const realmUrl = this.createRealmUrl();
    const redirectUri = keycloakUtils.getValidRedirectUri();
    const sessionState = uuid();
    const sessionNonce = uuid();

    const {
      response_type = 'code',
      redirect_uri = redirectUri,
      client_id = this.props.clientId,
      response_mode = 'query',
    } = query;

    const stringifiedQuery = queryString.stringify({
      response_type,
      response_mode,
      redirect_uri,
      client_id,
      state: sessionState,
      nonce: sessionNonce,
    });

    Storage.set( 'kcSessionState', sessionState );
    Storage.set( 'kcSessionNonce', sessionNonce );

    return `${realmUrl}/protocol/openid-connect/${action}?${stringifiedQuery}`;
  }

  createLoginUrl = options => {
    const url = this.createActionUrl( 'auth', options );

    return new Url( url );
  }

  createRegisterUrl = options => {
    const url = this.createActionUrl( 'registrations', options );

    return new Url( url );
  }

  createLogoutUrl = options => {
    const realmUrl = this.createRealmUrl();
    const redirectUri = keycloakUtils.getValidRedirectUri();

    const query = queryString.stringify({
      redirect_uri: redirectUri,
      ...options,
    });

    const url = `${realmUrl}/protocol/openid-connect/logout?${query}`;

    return new Url( url );
  }

  handleAuthSuccess = async code => {
    await this.asyncSetState({
      isAuthenticating: false,
      isRegistering: false,
      isAuthenticated: true,
    });

    this.startTokenRefresh( code );

    if ( this.state.promise ) {
      this.state.promise.resolve();

      this.setState({ promise: null });
    }
  }

  startTokenRefresh( code ) {
    this.handleTokenRefresh( code );

    this.setState({
      refreshTimer: setInterval( this.handleTokenRefresh, 5000 ), // 5 seconds
    });
  }

  handleFinishBrowserSession = action => ({ type }) => {
    const { promise } = this.state;

    if ( type === 'cancel' ) {
      if ( promise )
        promise.reject( `Could not ${action}! User dismissed window - try again.` );

      this.setState({
        error: `Could not ${action}! User dismissed window - try again.`,
      });
    }
  }

  handleTokenRefresh = async code => {
    const realmUrl = this.createRealmUrl();
    const url = `${realmUrl}/protocol/openid-connect/token`;
    const { refreshToken } = this.state;
    const { clientId } = this.props;

    const redirectUrl = keycloakUtils.getValidRedirectUri({
      excludeSearch: true,
      excludePathname: true,
    });

    const grantType = code
      ? 'authorization_code'
      : 'refresh_token';

    const grant = code
      ? { code }
      : { refresh_token: refreshToken };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: queryString.stringify({
        ...grant,
        grant_type: grantType,
        redirect_uri: redirectUrl,
        client_id: clientId,
      }),
    };

    this.setState({ isFetchingToken: true });

    try {
      const response = await fetch( url, options );
      const responseJson = await response.json();

      // const { session_state } = responseJson;
      // const sessionState = await Storage.get( 'kcSessionState' );

      /* TODO fix check */
      // if ( session_state === sessionState )
        this.handleTokenRefreshSuccess( responseJson );
    }
    catch ( error ) {
      this.handleError( error );
    }
    finally {
      this.setState({ isFetchingToken: false });
    }
  }

  handleTokenRefreshSuccess = async ({ access_token, refresh_token, id_token, expires_in, refresh_expires_in }) => {
    const currentTime = new Date().getTime();
    const accessExpiresInSeconds = expires_in * 1000; // Convert from seconds to ms
    const refreshExpiresInSeconds = refresh_expires_in * 1000; // Convert from seconds to ms

    const setTokens = resolve => {
      this.setState({
        refreshToken: refresh_token,
        refreshTokenExpiresOn: currentTime + refreshExpiresInSeconds,
        accessToken: access_token,
        accessTokenExpiresOn: currentTime + accessExpiresInSeconds,
        idToken: id_token,
      }, resolve );
    };

    const setUserData = ( resolve, reject ) => {
      try {
        const decodedIdToken = keycloakUtils.decodeToken( id_token );

        this.setState({
          user: {
            email: decodedIdToken.email,
            firstName: decodedIdToken.given_name,
            lastName: decodedIdToken.family_name,
            fullName: decodedIdToken.name,
            username: decodedIdToken.preferred_username,
            id: decodedIdToken.sub,
          },
        }, resolve );
      }
      catch ( error ) {
        reject( error );
      }
    };

    /* Wait for the setState operations to finish. */
    await Promise.all( [
      new Promise( setTokens ),
      new Promise( setUserData ),
    ] );

    Storage.stringifyAndSet( 'kcAuth', {
      refreshToken: this.state.refreshToken,
      refreshTokenExpiresOn: this.state.refreshTokenExpiresOn,
      accessToken: this.state.accessToken,
      accessTokenExpiresOn: this.state.accessTokenExpiresOn,
      timestamp: new Date().getTime(),
    });
  }

  handleError = error => {
    this.setState({ error });

    if ( this.state.promise ) {
      this.state.promise.reject( error );

      this.setState({ promise: null });
    }
  }

  handleUrlDecoding = url => {
    const { sessionState } = this.state;
    const { query } = queryString.parseUrl( url );

    if (
      query &&
      query.state &&
      query.state === sessionState &&
      query.code
    ) {
      this.handleAuthSuccess( query.code );
    }
    else {
      this.handleError( 'Unable to decode keycloak URL after returning from auth screen.' );
    }
  }

  hasTokenExpired( expiresOn ) {
    const currentTime = new Date().getTime();

    return currentTime > expiresOn;
  }

  handleUrlChange = event => {
    const { url } = event;
    const { browserSession } = this.state;
    const appUrl = keycloakUtils.getValidRedirectUri();

    if ( url.startsWith( appUrl )) {
      if ( browserSession ) {
        browserSession
          .removeEventListener( 'url', this.handleUrlChange )
          .close();
      }

      this.handleUrlDecoding( url );
    }
  }

  handleUrlDecoding = async url => {
    const sessionState = await Storage.get( 'kcSessionState' );
    const { query } = queryString.parseUrl( url );

    if ( !query ) return;
    if ( typeof query !== 'object' ) return;
    if ( Object.keys( query ).length === 0 ) return;

    if (
      query.state &&
      query.state === sessionState &&
      query.code
    ) {
      this.handleAuthSuccess( query.code );
    }
    else {
      this.handleError( 'Unable to decode keycloak URL after returning from auth screen.', { query, sessionState });
    }
  }

  render() {
    return (
      <KeycloakContext.Provider value={this.state}>
        {this.props.children}
      </KeycloakContext.Provider>
    );
  }
}

export default KeycloakProvider;
