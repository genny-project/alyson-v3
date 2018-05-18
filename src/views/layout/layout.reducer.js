const initialState = {
  hideSidebar: false,
  hideHeader: false,
};

const reducer = ( state = initialState, { type, payload }) => {
  switch ( type ) {
    case 'LAYOUT_SIDEBAR_VISIBILITY_SET':
      return {
        ...state,
        hideSidebar: payload,
      };

    case 'LAYOUT_HEADER_VISIBILITY_SET':
      return {
        ...state,
        hideHeader: payload,
      };

    default:
      return state;
  }
};

export default reducer;
