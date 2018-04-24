import { SIDEBAR_OPEN, SIDEBAR_CLOSE, SIDEBAR_TOGGLE } from '../../../constants';

export const openSidebar = () => ({
  type: SIDEBAR_OPEN,
});

export const closeSidebar = () => ({
  type: SIDEBAR_CLOSE,
});

export const toggleSidebar = () => ({
  type: SIDEBAR_TOGGLE,
});
