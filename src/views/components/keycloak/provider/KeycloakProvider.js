/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Platform, Linking } from 'react-native';
import { string, any } from 'prop-types';
import queryString from 'query-string';
import uuid from 'uuid/v4';
import config from '../../../../config';
import * as actions from '../../../../redux/actions';
import store from '../../../../redux/store';
import KeycloakContext from '../context';
import { Url, Storage, Api } from '../../../../utils';
import * as keycloakUtils from '../../../../utils/keycloak';

const TOKEN_REFRESH_TIMER = 30000;

class KeycloakProvider extends Component {
  static propTypes = {
    realm: string.isRequired,
    clientId: string.isRequired,
    clientSecret: string,
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
    const isValidUrl = Linking.canOpenURL( LoginUrl.getUrl());

    if ( !isValidUrl ) {
      // eslint-disable-next-line no-console
      console.warn( `Attempted to open invalid login URL: ${LoginUrl.getUrl()}` );

      return;
    }

    this.setState({
      isAuthenticating: true,
      error: null,
      browserSession: LoginUrl,
    });

    return new Promise( async ( resolve, reject ) => {
      await this.asyncSetState({ promise: { resolve, reject } });

      LoginUrl
        .addEventListener( 'url', this.handleAuthUrlChange )
        .open({ replaceUrl })
        .then( resolve )
        .catch( reject );
    });
  }

  attemptRegister = ( options = {}) => {
    if ( this.state.isAuthenticated ) return;

    const {
      replaceUrl = false,
    } = options;

    const RegisterUrl = this.createRegisterUrl();
    const isValidUrl = Linking.canOpenURL( RegisterUrl.getUrl());

    if ( !isValidUrl ) {
      // eslint-disable-next-line no-console
      console.warn( `Attempted to open invalid register URL: ${RegisterUrl.getUrl()}` );

      return;
    }

    this.setState({
      isAuthenticating: true,
      error: null,
      browserSession: RegisterUrl,
    });

    return new Promise( async ( resolve, reject ) => {
      await this.asyncSetState({ promise: { resolve, reject } });

      const session = await RegisterUrl
        .addEventListener( 'url', this.handleAuthUrlChange )
        .open({ replaceUrl });

      resolve( session );
    });
  }

  attemptLogout = async ( options = {}) => {
    if ( !this.state.isAuthenticated )
      throw new Error( 'You are already logged out!' );

    const {
      replaceUrl = false,
    } = options;

    const LogoutUrl = this.createLogoutUrl();
    const isValidUrl = Linking.canOpenURL( LogoutUrl.getUrl());

    if (
      !isValidUrl &&
      Platform.OS === 'web'
    ) {
      return new Error( `Attempted to open invalid logout URL: ${LogoutUrl.getUrl()}` );
    }

    if ( this.state.refreshTimer )
      clearInterval( this.state.refreshTimer );

    store.dispatch(
      actions.userLogout()
    );

    /* Make sure to wait for each of these functions to finish. */
    const promises = [
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
        consecutiveTokenFails: 0,
      }),
    ];

    /* Wait for the above promises to all finish. */
    await Promise.all( promises );

    await LogoutUrl
      .addEventListener( 'url', this.handleLogoutUrlChange )
      .open({ replaceUrl });

    return new Promise(( resolve, reject ) => {
      if ( Platform.OS === 'web' ) {
        this.setState({ promise: { resolve, reject } });
      }
      else {
        resolve();
      }
    });
  }

  createLoginUrl = options => {
    const url = this.createActionUrl( 'auth', options );

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

  doLoginWithApi = async ( options = {}) => {
    const realmUrl = this.createRealmUrl();
    const endpoint = `${realmUrl}/protocol/openid-connect/token`;

    const {
      grant_type = 'password',
      client_id = this.props.clientId,
      client_secret = this.props.clientSecret,
    } = options;

    const data = queryString.stringify({
      client_id,
      client_secret,
      grant_type,
      username: options.username || options.email,
      password: options.password,
    });

    try {
      const response = await Api.promiseCall({
        method: 'post',
        url: endpoint,
        data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      this.handleTokenRefreshSuccess( response.data );

      return true;
    }
    catch ( error ) {
      // eslint-disable-next-line no-console
      console.warn( error );

      throw new Error( error );
    }
  }

  doRegisterWithApi = async data => {
    const { baseUrl, realm } = this.props;
    const apiUrl = store.getState().keycloak.data.api_url;
    const endpoint = `${apiUrl}/keycloak/register`;
    const registrationData = { ...data };

    if (
      !registrationData.username &&
      registrationData.email
    ) {
      registrationData.username = registrationData.email;
    }

    const body = {
      ...registrationData,
      keycloakUrl: baseUrl,
      realm,
    };

    try {
      await Api.promiseCall({
        method: 'post',
        url: endpoint,
        data: body,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.doLoginWithApi( data );
    }
    catch ( error ) {
      // eslint-disable-next-line no-console
      console.warn( error );

      throw new Error( error );
    }
  }

  handleAuthSuccess = async code => {
    this.setState({
      isAuthenticating: false,
      isAuthenticated: true,
    });

    this.startTokenRefresh( code );

    if ( this.state.promise ) {
      this.state.promise.resolve();

      this.setState({ promise: null });
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

  /* eslint-enable react/sort-comp */

  state = {
    isAuthenticated: false,
    isAuthenticating: false,
    isCheckingCallback: false,
    isCheckingStorage: true,
    accessToken: null,
    refreshToken: null,
    refreshTimer: null,
    sessionState: null,
    sessionNonce: null,
    error: null,
    user: {},
    isFetchingToken: false,
    consecutiveTokenFails: 0,
    attemptLogin: this.attemptLogin,
    attemptRegister: this.attemptRegister,
    attemptLogout: this.attemptLogout,
    createLoginUrl: this.createLoginUrl,
    createLogoutUrl: this.createLogoutUrl,
    doLoginWithApi: this.doLoginWithApi,
    doRegisterWithApi: this.doRegisterWithApi,
    handleUrlDecoding: this.handleUrlDecoding,
  }

  componentDidMount = () => {
    this.checkStorage();

    if ( Platform.OS === 'web' )
      this.checkCallback();
  }

  componentDidUpdate( prevProps, prevState ) {
    if (
      !prevState.accessToken &&
      this.state.accessToken
    ) {
      store.dispatch(
        actions.attemptAuthSuccess({
          accessToken: this.state.accessToken,
        })
      );
    }
  }

  componentWillUnmount() {
    if ( this.state.refreshTimer )
      clearInterval( this.state.refreshTimer );
  }

  asyncSetState = state => {
    return new Promise( resolve => this.setState( state, resolve ));
  }

  checkStorage = async () => {
    this.setState({
      isCheckingStorage: true,
    });

    try {
      const session = await Storage.getAndParse( 'kcAuth' );

      if ( !session )
        throw false;

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
    finally {
      this.setState({
        isCheckingStorage: false,
      });
    }
  }

  checkCallback = async () => {
    this.setState({
      isCheckingCallback: true,
    });

    try {
      const sessionState = await Storage.get( 'kcSessionState' );
      const { state, code, ...restQuery } = queryString.parse( location.search );
      const numberOfRestQueries = restQuery ? Object.keys( restQuery ).length : 0;

      if ( !sessionState ) throw false;
      if ( !state ) throw false;
      if ( !code ) throw false;

      /* Remove `state` and `code` from the URL query params. */
      let newUrl = location.pathname;

      if ( numberOfRestQueries.length > 0 )
        newUrl += `?${queryString.stringify( restQuery )}`;

      history.replaceState({}, null, newUrl );

      /* Ensure the sessions are aligned. */
      if ( sessionState === state )
        this.handleAuthSuccess( code );
    }
    catch ( e ) {
      /* We don't care if there is an error. */
    }
    finally {
      this.setState({
        isCheckingCallback: false,
      });
    }
  }

  createRealmUrl() {
    const { baseUrl, realm } = this.props;
    const encodedRealm = encodeURIComponent( realm );

    return `${baseUrl}/realms/${encodedRealm}`;
  }

  createActionUrl = ( action, query = {}) => {
    const realmUrl = this.createRealmUrl();
    const redirectUri = keycloakUtils.getValidRedirectUri();
    const sessionState = uuid();
    const sessionNonce = uuid();

    const {
      response_type = 'code',
      redirect_uri = query.redirectUri || redirectUri,
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

  createRegisterUrl = options => {
    const url = this.createActionUrl( 'registrations', options );

    return new Url( url );
  }

  startTokenRefresh( code ) {
    this.handleTokenRefresh( code );

    this.setState({
      refreshTimer: setInterval( this.handleTokenRefresh, TOKEN_REFRESH_TIMER ),
    });
  }

  handleFinishBrowserSession = action => ({ type }) => {
    const { promise } = this.state;

    if ( type === 'cancel' ) {
      const error = `Could not ${action}! User dismissed window - try again.`;

      if ( promise )
        promise.reject( error );

      this.setState({ error });
    }
  }

  handleTokenRefresh = async code => {
    const realmUrl = this.createRealmUrl();
    const url = `${realmUrl}/protocol/openid-connect/token`;
    const { refreshToken } = this.state;
    const { clientId, clientSecret } = this.props;

    const redirectUrl = keycloakUtils.getValidRedirectUri({
      excludeSearch: true,
      excludePathname: true,
    }) || config.keycloak.redirectUri;

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
        ...clientSecret && {
          client_secret: clientSecret,
        },
      }),
    };

    this.setState({ isFetchingToken: true });

    try {
      const response = await fetch( url, options );
      const responseJson = await response.json();

      // const { session_state } = responseJson;
      // const sessionState = await Storage.get( 'kcSessionState' );

      /* FIXME: fix check */
      // if ( session_state === sessionState )

      /* If the token refresh has failed log the user out */
      if ( !response.ok ) {
        this.attemptLogout();
      }

      this.handleTokenRefreshSuccess( responseJson );
    }
    catch ( error ) {
      await this.asyncSetState( state => ({
        consecutiveTokenFails: state.consecutiveTokenFails + 1,
      }));

      const { consecutiveTokenFails } = this.state;

      /* If the token refresh fails three times in a row, log the user out. */
      if ( consecutiveTokenFails > 2 ) {
        this.attemptLogout();
      }
      else {
        /* Wait one second, then try refresh. */
        setTimeout( this.handleTokenRefresh, 1000 );
      }

      this.handleError( error );
    }
    finally {
      this.setState({ isFetchingToken: false });
    }
  }

  handleApiRegistrationSuccess = () => {}

  handleTokenRefreshSuccess = async ({
    access_token,
    refresh_token,
    id_token,
    expires_in,
    refresh_expires_in,
  }) => {
    const currentTime = new Date().getTime();
    const accessExpiresInSeconds = expires_in * 1000; // Convert from seconds to ms
    const refreshExpiresInSeconds = refresh_expires_in * 1000; // Convert from seconds to ms

    const setTokens = new Promise( resolve => {
      this.setState({
        isAuthenticated: true,
        refreshToken: refresh_token,
        refreshTokenExpiresOn: currentTime + refreshExpiresInSeconds,
        accessToken: access_token,
        accessTokenExpiresOn: currentTime + accessExpiresInSeconds,
        idToken: id_token,
        consecutiveTokenFails: 0,
      }, resolve );
    });

    const setUserData = new Promise(( resolve, reject ) => {
      try {
        if ( id_token || access_token ) {
          const decodedIdToken = keycloakUtils.decodeToken( id_token || access_token );

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
        else {
          resolve();
        }
      }
      catch ( error ) {
        // eslint-disable-next-line no-console
        console.warn({ error });

        reject( error );
      }
    });

    /* Wait for these operations to finish. */
    await Promise.all(
      [setTokens, setUserData]
    );

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

  handleLogoutUrlChange = event => {
    const { url } = event;
    const { browserSession } = this.state;
    const appUrl = keycloakUtils.getValidRedirectUri();

    if ( url.startsWith( appUrl )) {
      if ( browserSession ) {
        browserSession
          .removeEventListener( 'url', this.handleLogoutUrlChange )
          .close();
      }

      if ( this.state.promise ) {
        this.state.promise.resolve();

        this.setState({ promise: null });
      }
    }
  }

  handleAuthUrlChange = event => {
    const { url } = event;
    const appUrl = keycloakUtils.getValidRedirectUri();

    if ( url.startsWith( appUrl )) {
      this.handleUrlDecoding( url );
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
