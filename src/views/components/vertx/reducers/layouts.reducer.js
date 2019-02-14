/* eslint-disable */

import dlv from 'dlv';
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
        const linkTypes = {
          LNK_THEME: 'theme',
          LNK_FRAME: 'frame',
          LNK_ASK: 'ask',
        };

        return {
          code: link.link.targetCode,
          weight: link.link.weight,
          panel: link.link.linkValue,
          type: linkTypes[link.link.attributeCode]
            ? linkTypes[link.link.attributeCode]
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
  const attributes = {};

  // console.log( item.baseEntityAttributes );
  item.baseEntityAttributes.forEach( attribute => {
    // console.log( attribute );
    attributes[attribute.attributeCode] = attribute;
  });

  // console.log( attributes );

  const themeData = dlv( attributes, 'PRI_CONTENT.value' );
  const isInheritable = dlv( attributes, 'PRI_IS_INHERITABLE.value' );

  /* alter the state */

  if ( state.themes ) {
    state.themes[item.code] = {
      name: item.name,
      code: item.code,
      data: themeData,
      isInheritable: isInheritable != null ? isInheritable : true,
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
