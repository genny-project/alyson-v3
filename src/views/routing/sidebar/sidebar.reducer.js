import { SIDEBAR_OPEN, SIDEBAR_CLOSE, SIDEBAR_TOGGLE } from '../../../constants';

const initialState = {
  open: false,
};

const reducer = ( state = initialState, { type }) => {
  switch ( type ) {
    case SIDEBAR_OPEN:
      return {
        open: true,
      };

    case SIDEBAR_CLOSE:
      return {
        open: false,
      };

    case SIDEBAR_TOGGLE:
      return {
        open: !state,
      };

    default:
      return state;
  }
};

export default reducer;
