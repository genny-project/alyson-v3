/* eslint-disable */

import { isArray, isString, isObject } from '../../../../utils';
import { FETCH_PUBLIC_LAYOUTS_FAILURE, FETCH_PUBLIC_LAYOUTS_SUCCESS } from '../../../../constants';

const initialState = {
  frames: {},
  themes: {},
};

const injectFrameIntoState = ({ item, state }) => {
  // console.log( 'injectFrameIntoState', item, state, state.frames );
  /* alter the state */

  if ( state.frames ) {
    state.frames[item.code] = {
      name: item.name,
      code: item.code,
      links: item.links.map( link => {
        return {
          code: link.link.targetCode,
          weight: link.link.weight,
          panel: link.link.linkValue,
          type: link.link.attributeCode === 'LNK_THEME'
            ? 'theme'
            : link.link.attributeCode === 'LNK_FRAME'
              ? 'frame'
              : 'none',
          created: link.created,
        };
      }),
      created: item.created,
    };
  }
};

const injectThemeIntoState = ({ item, state }) => {
  // console.log( 'injectThemeIntoState', item, state, state.themes );
  const attributes = item.baseEntityAttributes;
  const themeDataAttributes = attributes.filter( attribute => attribute.attributeCode === 'PRI_CONTENT' );
  const themeData = isArray( themeDataAttributes, { ofMinLength: 1 })
    ? themeDataAttributes[0] : null;
  /* alter the state */

  if ( state.themes ) {
    state.themes[item.code] = {
      name: item.name,
      code: item.code,
      data: isObject( themeData, { withProperty: 'value' }) ? themeData.value : {},
      created: item.created,
    };
  }
};

const reducer = ( state = initialState, { type, payload }) => {
  // console.log( type, payload );
  switch ( type ) {
    case 'BASE_ENTITY_MESSAGE': {
      if ( !isArray( payload.items, { ofMinLength: 1 }))
        return state;

      /* Loop through all of the layouts and store them in their corresponding layout groups. */
      return payload.items.reduce(( newState, item ) => {
        // console.log( newState );
        try {
          if ( isString( item.code, { startsWith: 'FRAME_' })) {
            injectFrameIntoState({ item, state: newState });
          }
          else if ( isString( item.code, { startsWith: 'THEME_' })) {
            injectThemeIntoState({ item, state: newState });
          }
          else {
            return state;
          }
        }
        catch ( error ) {
          // eslint-disable-next-line no-console
          console.warn( 'Unable to add layout to reducer state', error, item.code, item );
        }

        return newState;
      }, { ...state });
    }

    case FETCH_PUBLIC_LAYOUTS_FAILURE:
    case FETCH_PUBLIC_LAYOUTS_SUCCESS:
    case 'CLEAR_ALL_LAYOUTS':
    case 'USER_LOGOUT':
      return { ...initialState };

    default:
      return state;
  }
};

export default reducer;
