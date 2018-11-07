const initialState = {};

const reducer = ( state = initialState, { type, payload }) => {
  switch ( type ) {
    case 'DIALOG_TOGGLE':
      return {
        ...state,
        [payload.layoutName]: {
          params: {},
          ...state[payload.layoutName],
          show: payload.show != null
            ? payload.show
            : ( state[payload.layoutName] && !state[payload.layoutName].show ),
        },
      };

    case '@@router/LOCATION_CHANGE': {
      const keys = Object.keys( state );

      return keys.reduce(( dialogs, dialog ) => {
        dialogs[dialog] = {
          params: {},
          ...dialogs[dialog],
          show: false,
        };

        return dialogs;
      }, { ...state });
    }

    case 'DIALOG_PARAMS_SET':
      return {
        ...state,
        [payload.layoutName]: {
          ...state[payload.layoutName],
          params: payload.params,
        },
      };

    case 'USER_LOGOUT':
      return { ...initialState };

    default:
      return state;
  }
};

export default reducer;
