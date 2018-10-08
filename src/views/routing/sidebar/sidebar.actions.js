import { SIDEBAR_OPEN, SIDEBAR_CLOSE, SIDEBAR_TOGGLE } from '../../../constants';

export const openSidebar = ( side = 'left' ) => ({
  type: SIDEBAR_OPEN,
  payload: side,
});

export const closeSidebar = ( side = 'left' ) => ({
  type: SIDEBAR_CLOSE,
  payload: side,
});

export const toggleSidebar = ( side = 'left' ) => ({
  type: SIDEBAR_TOGGLE,
  payload: side,
});
