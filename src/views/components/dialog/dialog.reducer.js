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

    case 'USER_LOGOUT':
      return { ...initialState };

    default:
      return state;
  }
};

export default reducer;
