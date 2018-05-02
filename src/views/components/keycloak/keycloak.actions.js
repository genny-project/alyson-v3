import { KEYCLOAK_CONFIG_FETCH_REQUEST, KEYCLOAK_CONFIG_FETCH_SUCCESS, KEYCLOAK_CONFIG_FETCH_FAILURE } from '../../../constants';

export const fetchKeycloakConfig = () => ({
  type: KEYCLOAK_CONFIG_FETCH_REQUEST,
});

export const fetchKeycloakConfigSuccess = config => ({
  type: KEYCLOAK_CONFIG_FETCH_SUCCESS,
  payload: config,
});

export const fetchKeycloakConfigFailure = error => ({
  type: KEYCLOAK_CONFIG_FETCH_FAILURE,
  payload: error,
});

export const attemptAuth = () => ({
  type: 'AUTH_SUCCESS',
});

export const attemptAuthSuccess = data => ({
  type: 'AUTH_ATTEMPT_SUCCESS',
  payload: data,
});

export const attemptAuthFailure = error => ({
  type: 'AUTH_ATTEMPT_FAILURE',
  payload: error,
});

/*

The actions below are not in use.

Please use the Keycloak context pattern instead.

*/

export const attemptCheckStorageForToken = () => ({
  type: 'TOKEN_STORAGE_CHECK_ATTEMPT',
});

export const successCheckStorageForToken = () => ({
  type: 'TOKEN_STORAGE_CHECK_SUCCESS',
});

export const attemptLogin = () => ({
  type: 'LOGIN_ATTEMPT',
});

export const attemptRegister = () => ({
  type: 'REGISTER_ATTEMPT',
});

export const attemptLogout = () => ({
  type: 'LOGOUT_ATTEMPT',
});

export const successLogin = data => ({
  type: 'LOGIN_SUCCESS',
  payload: data,
});

export const successRegister = data => ({
  type: 'REGISTER_SUCCESS',
  payload: data,
});

export const successLogout = () => ({
  type: 'LOGOUT_SUCCESS',
});

export const errorLogin = error => ({
  type: 'LOGIN_ERROR',
  payload: error,
});

export const errorRegister = error => ({
  type: 'REGISTER_ERROR',
  payload: error,
});

export const errorLogout = error => ({
  type: 'LOGOUT_ERROR',
  payload: error,
});
