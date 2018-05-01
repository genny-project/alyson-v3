import { SIDEBAR_OPEN, SIDEBAR_CLOSE, SIDEBAR_TOGGLE } from '../../../constants';

const initialState = {
  isOpen: false,
};

const reducer = ( state = initialState, { type }) => {
  switch ( type ) {
    case SIDEBAR_OPEN:
      return {
        isOpen: true,
      };

    case SIDEBAR_CLOSE:
      return {
        isOpen: false,
      };

    case SIDEBAR_TOGGLE:
      return {
        isOpen: !state.isOpen,
      };

    default:
      return state;
  }
};

export default reducer;
