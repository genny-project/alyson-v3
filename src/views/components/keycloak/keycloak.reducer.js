// import { combineReducers } from 'redux';
import { KEYCLOAK_CONFIG_FETCH_REQUEST, KEYCLOAK_CONFIG_FETCH_SUCCESS, KEYCLOAK_CONFIG_FETCH_FAILURE } from '../../../constants';

const configInitialState = {
  data: {},
  fetching: false,
  fetched: false,
  error: null,
  accessToken: null,
};

const configReducer = ( state = configInitialState, { type, payload }) => {
  switch ( type ) {
    case KEYCLOAK_CONFIG_FETCH_REQUEST:
      return {
        ...state,
        fetching: true,
        error: null,
      };

    case KEYCLOAK_CONFIG_FETCH_SUCCESS:
      return {
        ...state,
        fetching: false,
        fetched: true,
        data: payload,
      };

    case KEYCLOAK_CONFIG_FETCH_FAILURE:
      return {
        ...state,
        fetching: false,
        error: payload,
      };

    case 'AUTH_ATTEMPT_SUCCESS':
      return {
        ...state,
        accessToken: payload.accessToken,
      };

    default:
      return state;
  }
};

export default configReducer;

// TODO: use me when another sub-reducer is made
// export default combineReducers({
// configReducer,
// });
