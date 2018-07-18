const initialState = {
  connecting: true,
  connected: false,
  error: null,
};

const reducer = ( state = initialState, { type, payload }) => {
  switch ( type ) {
    case 'VERTX_INIT_ATTEMPT':
      return {
        ...state,
        connecting: true,
        error: null,
      };

    case 'VERTX_INIT_SUCCESS':
      return {
        ...state,
        connecting: false,
        connected: true,
      };

    case 'VERTX_INIT_FAILURE':
      return {
        ...state,
        connecting: false,
        error: payload,
      };

    case 'USER_LOGOUT':
      return { ...initialState };

    default:
      return state;
  }
};

export default reducer;
