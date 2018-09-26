const initialState = {};

const reducer = ( state = initialState, { type, payload }) => {
  switch ( type ) {
    case 'DIALOG_TOGGLE':
      return {
        ...state,
        [payload.layoutName]: {
          show: payload.show,
        },
      };

    case '@@router/LOCATION_CHANGE': {
      const keys = Object.keys( state );

      return keys.reduce(( dialogs, dialog ) => {
        dialogs[dialog] = {
          ...dialogs[dialog],
          show: false,
        };

        return dialogs;
      }, { ...state });
    }

    case 'USER_LOGOUT':
      return { ...initialState };

    default:
      return state;
  }
};

export default reducer;
