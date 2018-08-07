import { isArray } from '../../../../utils';
import { FETCH_PUBLIC_LAYOUTS_FAILURE, FETCH_PUBLIC_LAYOUTS_SUCCESS } from '../../../../constants';

const initialState = {
  public: {},
  pages: {},
  components: {},
  sublayouts: {},
};

const reducer = ( state = initialState, { type, payload }) => {
  switch ( type ) {
    case 'BASE_ENTITY_MESSAGE': {
      if ( !isArray( payload.items, { ofMinLength: 1 }))
        return state;

      for ( let i = 0; i++; i < payload.items.length ) {
        // const item = payload.items[i];
      }

      return state;
    }

    case FETCH_PUBLIC_LAYOUTS_FAILURE: {
      return state;
    }

    case FETCH_PUBLIC_LAYOUTS_SUCCESS: {
      console.warn( payload );

      return state;
    }

    case 'USER_LOGOUT':
      return { ...initialState };

    default:
      return state;
  }
};

export default reducer;
