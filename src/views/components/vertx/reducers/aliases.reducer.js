const reducer = ( state = {}, { type, payload }) => {
  switch ( type ) {
    case 'BASE_ENTITY_MESSAGE': {
      if (
        payload.aliasCode &&
        payload.items &&
        payload.items instanceof Array &&
        payload.items.length === 1 // Only alias this if there is 1 item in the message.
      ) {
        return {
          ...state,
          [payload.aliasCode]: payload.items[0].code,
        };
      }

      return state;
    }

    default:
      return state;
  }
};

export default reducer;
