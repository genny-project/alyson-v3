import { isArray, isString, removeStartingAndEndingSlashes } from '../../../../utils';
import { FETCH_PUBLIC_LAYOUTS_FAILURE, FETCH_PUBLIC_LAYOUTS_SUCCESS } from '../../../../constants';

const initialState = {
  pages: {},
  sublayouts: {},
  queries: {},
  dialogs: {},
  error: null,
  hasLoadedDevLayouts: false,
};

const layoutGroups = ['pages', 'sublayouts', 'dialogs', 'queries'];

/* This function makes use of mutation for the `state` param. As we're passing through an
 * object to this function, it is being passed through by reference (and not value), so we
 * are able to modify the object inside this function and use the changes in the local variable
 * (that is, whatever we passed into `state`) from the block this function was called from.
 * See uses. */
const injectLayoutIntoState = ({ uri, data, state, isDevLayout, isPublic = false }) => {
  /* Use of `Array.some()` here is to counteract using `Array.forEach()`,
  * but we only want to loop through `layoutGroups` until we find the corresponding
  * group to the layout URI. `.some()` allows us to cancel out at any time by
  * returning `true` when we are done. */
  const didFindAGroup = layoutGroups.some( layoutGroup => {
    const group = `${layoutGroup}/`;

    if ( uri.startsWith( group )) {
      /* Remove the group from the start of the URI,
       * and remove the starting and ending slashes. */
      const newUri = removeStartingAndEndingSlashes(
        uri.split( group )[1]
      );

      /* If it's already in the reducer and it's a dev layout, no not overwrite it. */
      if (
        state[layoutGroup][newUri] &&
        state[layoutGroup][newUri].isDevLayout
      ) {
        return true;
      }

      state[layoutGroup][newUri] = data;
      state[layoutGroup][newUri].isPublic = isPublic;

      if ( isDevLayout )
        state[layoutGroup][newUri].isDevLayout = true;

      return true;
    }
  });

  /* Default to saving it in `sublayouts`. */
  if ( !didFindAGroup ) {
    const newUri = removeStartingAndEndingSlashes( uri );

    /* If it's already in the reducer and it's a dev layout, no not overwrite it. */
    if (
      state.sublayouts[newUri] &&
      state.sublayouts[newUri].isDevLayout
    ) {
      return;
    }

    state.sublayouts[newUri] = data;

    if ( isDevLayout )
      state.sublayouts[newUri].isDevLayout = true;
  }
};

const reducer = ( state = initialState, { type, payload }) => {
  switch ( type ) {
    case 'BASE_ENTITY_MESSAGE': {
      // if ( state.hasLoadedDevLayouts )
        // return state;

      if ( !isArray( payload.items, { ofMinLength: 1 }))
        return state;

      /* Loop through all of the layouts and store them in their corresponding layout groups. */
      return payload.items.reduce(( newState, item ) => {
        try {
          const { code, baseEntityAttributes } = item;

          if ( !isString( code, { startsWith: 'LAY_' }))
            return newState;

          const uri = baseEntityAttributes.find( attribute => attribute.attributeCode === 'PRI_LAYOUT_URI' ).value;
          const data = JSON.parse(
            baseEntityAttributes.find( attribute => attribute.attributeCode === 'PRI_LAYOUT_DATA' ).value
          );

          injectLayoutIntoState({ uri, data, state: newState });
        }
        catch ( error ) {
          // eslint-disable-next-line no-console
          console.warn( 'Unable to add layout to reducer state', error, item.code );
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

          injectLayoutIntoState({ uri, data: parsed, state: newState, isDevLayout: true });
        }
        catch ( error ) {
          // eslint-disable-next-line no-console
          console.warn( 'Unable to add layout to reducer state', error );
        }

        return newState;
      }, {
        ...state,
        hasLoadedDevLayouts: true,
      });
    }

    case FETCH_PUBLIC_LAYOUTS_FAILURE: {
      return {
        ...state,
        error: payload,
      };
    }

    case FETCH_PUBLIC_LAYOUTS_SUCCESS: {
      if ( !isArray( payload, { ofMinLength: 1 }))
        return state;

      const newState = { ...state };

      payload.forEach( layout => {
        const { uri, data } = layout;

        injectLayoutIntoState({ uri, data, state: newState, isPublic: true });
      });

      return newState;
    }

    case 'CLEAR_ALL_LAYOUTS': {
      return { ...initialState };
    }

    case 'USER_LOGOUT':
      return { ...initialState };

    default:
      return state;
  }
};

export default reducer;
