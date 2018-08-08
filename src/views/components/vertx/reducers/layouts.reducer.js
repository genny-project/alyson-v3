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

      /* Loop through all of the layouts and store them in their corresponding layout groups. */
      return payload.items.reduce(( newState, item ) => {
        if (
          !item ||
          !item.code ||
          !item.baseEntityAttributes
        ) {
          return newState;
        }

        const { code, baseEntityAttributes } = item;

        if ( !isString( code, { startsWith: 'LAY_' }))
          return newState;

        const uri = baseEntityAttributes.find( attribute => attribute.attributeCode === 'PRI_LAYOUT_URI' ).value;
        const data = baseEntityAttributes.find( attribute => attribute.attributeCode === 'PRI_LAYOUT_DATA' ).value;

        if (
          !uri ||
          !data
        ) {
          return newState;
        }

        try {
          const parsed = JSON.parse( data.value );

          /* Use of `Array.some()` here is to counteract using `Array.forEach()`,
           * but we only want to loop through `layoutGroups` until we find the corresponding
           * group to the layout URI. `.some()` allows us to cancel out at any time by
           * returning `true` when we are done. */
          layoutGroups.some( layoutGroup => {
            const group = `${layoutGroup}/`;

            if ( uri.value.startsWith( group )) {
              newState[layoutGroup][uri.value.split( group )[1]] = parsed;

              return true;
            }
          });
        }
        catch ( error ) {
          console.warn( 'Unable to add layout to reducer state', error );
        }

        return newState;
      }, { ...state });
    }

    case 'LOAD_DEV_LAYOUT': {
      const layouts = Object.keys( payload );

      /* Loop through all of the layouts and store them in their corresponding layout groups. */
      return layouts.reduce(( newState, layoutCode ) => {
        const layout = payload[layoutCode];
        const uri = layout.PRI_LAYOUT_URI.value;
        const data = layout.PRI_LAYOUT_DATA.value;

        try {
          const parsed = JSON.parse( data );

          /* Use of `Array.some()` here is to counteract using `Array.forEach()`,
           * but we only want to loop through `layoutGroups` until we find the corresponding
           * group to the layout URI. `.some()` allows us to cancel out at any time by
           * returning `true` when we are done. */
          layoutGroups.some( layoutGroup => {
            const group = `${layoutGroup}/`;

            if ( uri.startsWith( group )) {
              newState[layoutGroup][uri.split( group )[1]] = parsed;

              return true;
            }
          });
        }
        catch ( error ) {
          console.warn( 'Unable to add layout to reducer state', error );
        }

        return newState;
      }, { ...state });
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
