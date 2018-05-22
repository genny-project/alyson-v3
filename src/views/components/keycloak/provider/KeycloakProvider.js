/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Platform, Linking } from 'react-native';
import { string, any } from 'prop-types';
import queryString from 'query-string';
import uuid from 'uuid/v4';
import * as actions from '../../../../redux/actions';
import store from '../../../../redux/store';
import KeycloakContext from '../context';
import { Url, Storage } from '../../../../utils';
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
        .addEventListener( 'url', this.handleUrlChange )
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

    this.setState({
      isAuthenticating: true,
      error: null,
      browserSession: RegisterUrl,
    });

    return new Promise( async ( resolve, reject ) => {
      await this.asyncSetState({ promise: { resolve, reject } });

      const session = await RegisterUrl
        .addEventListener( 'url', this.handleUrlChange )
        .open({ replaceUrl });

      resolve( session );
    });
  }

  attemptLogout = () => {
    if ( !this.state.isAuthenticated ) return;

    const { accessToken, refreshToken } = this.state;
    const logoutUrl = this.createLogoutUrl();

    if ( this.state.refreshTimer )
      clearInterval( this.state.refreshTimer );

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
      }),
      fetch( logoutUrl, {
        method: 'post',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: queryString.parse({
          client_id: this.props.clientId,
          refresh_token: refreshToken,
        }),
      }),
    ];

    return new Promise(( resolve, reject ) => {
      Promise
        .all( promises )
        .then( resolve )
        .catch( reject );
    });
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
    attemptLogin: this.attemptLogin,
    attemptRegister: this.attemptRegister,
    attemptLogout: this.attemptLogout,
  }

  componentDidMount = () => {
    /**
     * TODO:
     *
     * Fix casting bug on Android
     *
     * Issue seems to be with the tokens being used from storage
     */
    if ( Platform.OS !== 'android' )
      this.checkStorage();
    else
      this.setState({ isCheckingStorage: false });

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
          accessToken: accessTokenHasExpired ? null : accessToken, // <-- HERE FIXME:
          refreshToken, // <-- AND HERE IS WHERE IT BREAKS ANDROID FIXME:
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

  createLogoutUrl = () => {
    const realmUrl = this.createRealmUrl();

    return `${realmUrl}/protocol/openid-connect/logout`;
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
      this.handleError( error );
    }
    finally {
      this.setState({ isFetchingToken: false });
    }
  }

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
      if ( Platform.OS !== 'android' ) {
        this.setState({
          refreshToken: refresh_token,
          refreshTokenExpiresOn: currentTime + refreshExpiresInSeconds,
          accessToken: access_token,
          accessTokenExpiresOn: currentTime + accessExpiresInSeconds,
          idToken: id_token,
        }, resolve );
      }
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
      }
      catch ( error ) {
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
