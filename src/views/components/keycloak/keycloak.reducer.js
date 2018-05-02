// import { combineReducers } from 'redux';
import { KEYCLOAK_CONFIG_FETCH_REQUEST, KEYCLOAK_CONFIG_FETCH_SUCCESS, KEYCLOAK_CONFIG_FETCH_FAILURE } from '../../../constants';

const configInitialState = {
  data: {},
  fetching: false,
  fetched: false,
  error: null,
};

const configReducer = ( state = configInitialState, { type, payload }) => {
  switch ( type ) {
    case KEYCLOAK_CONFIG_FETCH_REQUEST:
      return {
        fetching: true,
        error: null,
      };

    case KEYCLOAK_CONFIG_FETCH_SUCCESS:
      return {
        fetching: false,
        fetched: true,
        data: payload,
      };

    case KEYCLOAK_CONFIG_FETCH_FAILURE:
      return {
        fetching: false,
        error: payload,
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
