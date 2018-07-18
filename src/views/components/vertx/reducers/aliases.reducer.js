const reducer = ( state = {}, { type, payload }) => {
  switch ( type ) {
    case 'BASE_ENTITY_MESSAGE': {
      if (
        payload.aliasCode != null &&
        typeof payload.aliasCode === 'string' &&
        payload.items != null &&
        payload.items instanceof Array &&
        payload.items.length > 0 &&
        payload.items[0].code != null &&
        typeof payload.items[0].code === 'string'
      ) {
        return {
          ...state,
          [payload.aliasCode]: payload.items[0].code,
        };
      }

      return state;
    }

    case 'USER_LOGOUT':
      return {};

    default:
      return state;
  }
};

export default reducer;
