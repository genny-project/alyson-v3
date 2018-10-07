import { SIDEBAR_OPEN, SIDEBAR_CLOSE, SIDEBAR_TOGGLE } from '../../../constants';

const initialState = {
  left: {
    isOpen: false,
  },
  right: {
    isOpen: false,
  },
};

const reducer = ( state = initialState, { type, payload }) => {
  switch ( type ) {
    case SIDEBAR_OPEN:
      return {
        ...state,
        [payload]: {
          ...state[payload],
          isOpen: true,
        },
      };

    case SIDEBAR_CLOSE:
      return {
        ...state,
        [payload]: {
          ...state[payload],
          isOpen: false,
        },
      };

    case SIDEBAR_TOGGLE:
      return {
        ...state,
        [payload]: {
          ...state[payload],
          isOpen: !state.isOpen,
        },
      };

    default:
      return state;
  }
};

export default reducer;
