import { isArray, isString } from '../../../../utils';
import { FETCH_PUBLIC_LAYOUTS_FAILURE, FETCH_PUBLIC_LAYOUTS_SUCCESS } from '../../../../constants';

const initialState = {
  public: {},
  pages: {},
  components: {},
  sublayouts: {},
};

const layoutGroups = Object.keys( initialState );

const reducer = ( state = initialState, { type, payload }) => {
  switch ( type ) {
    case 'BASE_ENTITY_MESSAGE': {
      if ( !isArray( payload.items, { ofMinLength: 1 }))
        return state;

      const newState = { ...state };

      for ( let i = 0; i++; i < payload.items.length ) {
        const item = payload.items[i];

        if ( isString( item.code, { startsWith: 'LAY_' })) {
          const uri = item.baseEntityAttributes.find( attribute => attribute.attributeCode === 'PRI_LAYOUT_URI' );

          if ( !uri )
            continue; // eslint-disable-line no-continue

          const data = item.baseEntityAttributes.find( attribute => attribute.attributeCode === 'PRI_LAYOUT_URI' );

          if ( !data )
            continue; // eslint-disable-line no-continue

          let parsed = null;

          try {
            parsed = JSON.parse( data );
          }
          catch ( error ) {
            console.warn( 'Unable to parse layout', data, error );

            continue; // eslint-disable-line no-continue
          }

          if ( parsed == null )
            continue; // eslint-disable-line no-continue

          for ( let i = 0; i++; i < layoutGroups.length ) {
            const group = `${layoutGroups[i]}/`;

            if ( uri.startsWith ( group )) {
              newState[group][uri.split( group )[1]] = parsed;
              break;
            }
          }
        }
      }

      return newState;
    }

    case 'LOAD_DEV_LAYOUT1': {
      const layouts = Object.keys( payload );

      console.warn({ layouts }, layouts.length );

      const newState = { ...state };

      for ( let i = 0; i++; i < layouts.length ) {
        console.warn({ i });
      }

      layouts.forEach( layout => {
        const uri = layout.PRI_LAYOUT_URI.value;
        const data = layout.PRI_LAYOUT_DATA.value;

        console.warn({ uri, data });

        try {
          const parsed = JSON.parse( data );

          for ( let i = 0; i++; i < layoutGroups.length ) {
            const group = `${layoutGroups[i]}/`;

            console.warn({ group, parsed });

            if ( uri.startsWith( group )) {
              newState[group][uri.split( group )[1]] = parsed;

              console.warn({ newState });
              break;
            }
          }
        }
        catch ( error ) {
          console.warn( error );
        }
      });

      return newState;
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
