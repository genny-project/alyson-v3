import { isArray, isString, removeStartingAndEndingSlashes } from '../../../utils';

const initialState = {
  components: {},
  hasLoadedDevLayouts: false,
};

const reducer = ( state = initialState, { type, payload }) => {
  switch ( type ) {
    case 'THEME_COMPONENT_THEME_ADD': {
      return {
        ...state,
        components: {
          ...state.components,
          [payload.componentName]: {
            ...state.components[payload.componentName],
            [payload.themeName]: {
              props: payload.theme,
            },
          },
        },
      };
    }

    case 'BASE_ENTITY_MESSAGE': {
      if ( state.hasLoadedDevLayouts )
        return state;

      if ( !isArray( payload.items, { ofMinLength: 1 }))
        return state;

      /* Loop through all of the layouts and store them in their corresponding layout groups. */
      return payload.items.reduce(( newState, item ) => {
        try {
          const { code, baseEntityAttributes } = item;

          if ( !isString( code, { startsWith: 'LAY_' }))
            return newState;

          const uri = baseEntityAttributes.find( attribute => attribute.attributeCode === 'PRI_LAYOUT_URI' ).value;

          if ( uri.startsWith( 'components/' )) {
            /* Remove the group from the start of the URI,
            * and remove the starting and ending slashes. */

            const newUri = uri.split( 'components/' )[1];

            const componentName = removeStartingAndEndingSlashes(
              newUri.split( '-' )[0]
            );

            const themeName = removeStartingAndEndingSlashes(
              newUri.split( '-' )[1]
            );

            const data = JSON.parse(
              baseEntityAttributes.find( attribute => attribute.attributeCode === 'PRI_LAYOUT_DATA' ).value
            );

            newState.components[componentName] = {
              ...newState.components[componentName],
              [themeName]: {
                props: data,
              },
            };
          }
        }
        catch ( error ) {
          console.warn( 'Unable to add component to reducer state', error );
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

          if ( uri.startsWith( 'components/' )) {
            /* Remove the group from the start of the URI,
            * and remove the starting and ending slashes. */
            const newUri = uri.split( 'components/' )[1];

            const componentName = removeStartingAndEndingSlashes(
              newUri.split( '-' )[0]
            );

            const themeName = removeStartingAndEndingSlashes(
              newUri.split( '-' )[1]
            );

            newState.components[componentName] = {
              ...newState.components[componentName],
              [themeName]: {
                props: parsed,
                isDevLayout: true,
              },
            };
          }
        }
        catch ( error ) {
          console.warn( 'Unable to add component to reducer state', error );
        }

        return newState;
      }, {
        ...state,
        hasLoadedDevLayouts: true,
      });
    }

    case 'FETCH_PUBLIC_LAYOUTS_SUCCESS': {
      if ( !isArray( payload, { ofMinLength: 1 }))
        return state;

      const newState = { ...state };

      payload.forEach( layout => {
        const { uri, data } = layout;

        if ( uri.startsWith( 'components/' )) {
          /* Remove the group from the start of the URI,
            * and remove the starting and ending slashes. */
          const newUri = uri.split( 'components/' )[1];

          const componentName = removeStartingAndEndingSlashes(
            newUri.split( '-' )[0]
          );

          const themeName = removeStartingAndEndingSlashes(
            newUri.split( '-' )[1]
          );

          if (
            newState.components[componentName] &&
            newState.components[componentName][themeName] &&
            newState.components[componentName][themeName].isDevLayout
          ) {
            return;
          }

          newState.components[componentName] = {
            ...newState.components[componentName],
            [themeName]: {
              props: data,
            },
          };
        }
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
