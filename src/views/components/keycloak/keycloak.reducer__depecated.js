
const configInitialState = {
  data: {},
  fetching: false,
  fetched: false,
  error: null,
};

const configReducer = ( state = configInitialState, { type, payload }) => {
  switch ( type ) {
    case 'FETCH_KEYCLOAK_CONFIG_REQUEST':
      return {
        ...state,
        fetching: true,
        error: null,
      };

    case 'FETCH_KEYCLOAK_CONFIG_SUCCESS':
      return {
        ...state,
        fetching: false,
        fetched: true,
        data: payload,
      };

    case 'FETCH_KEYCLOAK_CONFIG_FAILED':
      return {
        ...state,
        fetching: false,
        error: payload,
      };
  }
};

// TODO: use me when another sub-reducer is made
// export default combineReducers({
  // configReducer,
// });

export default configReducer;

/*

The below reducer is not in use.

Please use the Keycloak consumer pattern instead.

*/

const initialState = {
  isAuthenticated: false,
  isAuthenticating: false,
  isUnauthenticating: false,
  isCheckingCallback: false,
  isCheckingStorage: false,
  accessToken: null,
  refreshToken: null,
  refreshTimer: null,
  sessionState: null,
  sessionNonce: null,
  error: null,
  user: {},
  isFetchingToken: false,
};

const reducer = ( state = initialState, { type, payload }) => {
  switch ( type ) {
    case 'LOGIN_ATTEMPT':
    case 'REGISTER_ATTEMPT':
      return {
        ...state,
        isAuthenticated: false,
        isAuthenticating: true,
        error: null,
      };

    case 'LOGIN_ERROR':
    case 'REGISTER_ERROR':
      return {
        ...state,
        isAuthenticating: false,
        error: payload,
      };

    case 'LOGOUT_ATTEMPT':
      return {
        ...state,
        isUnauthenticating: true,
      };

    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        isUnauthenticating: false,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        sessionState: null,
        sessionNonce: null,
        error: null,
        user: {},
      };

    case 'LOGOUT_ERROR':
      return {
        ...state,
        isUnauthenticating: false,
        error: payload,
      };

    case 'TOKEN_FETCH_ATTEMPT':
      return {
        ...state,
        isFetchingToken: true,
      };

    case 'TOKEN_FETCH_SUCCESS':
      return {
        ...state,
        isFetchingToken: false,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        user: payload.user,
      };

    case 'TOKEN_FETCH_ERROR':
      return {
        ...state,
        isFetchingToken: false,
        error: payload,
      };

    case 'TOKEN_STORAGE_CHECK_ATTEMPT':
      return {
        ...state,
        isCheckingStorage: true,
      };

    case 'TOKEN_STORAGE_CHECK_SUCCESS':
      return {
        ...state,
        isCheckingStorage: false,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        user: payload.user,
      };

    default:
      return state;
  }
};

export { reducer };
