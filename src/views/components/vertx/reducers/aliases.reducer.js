import omit from 'lodash.omit';

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

    case 'ALIAS_ADD':
      return {
        ...state,
        [payload.alias]: payload.value,
      };

    case 'ALIAS_REMOVE':
      return omit( state, payload.alias );

    case 'ALIAS_TOGGLE': {
      if ( state[payload.alias] === payload.value )
        return omit( state, payload.alias );

      return {
        ...state,
        [payload.alias]: payload.value,
      };
    }

    case 'USER_LOGOUT':
      return {};

    default:
      return state;
  }
};

export default reducer;
