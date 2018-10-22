import { FETCH_PUBLIC_LAYOUTS_SUCCESS, FETCH_PUBLIC_LAYOUTS_FAILURE } from '../../constants';

export const setSidebarVisibility = visible => ({
  type: 'LAYOUT_SIDEBAR_VISIBILITY_SET',
  payload: visible,
});

export const setSidebarRightVisibility = visible => ({
  type: 'LAYOUT_SIDEBAR_RIGHT_VISIBILITY_SET',
  payload: visible,
});

export const setHeaderVisibility = visible => ({
  type: 'LAYOUT_HEADER_VISIBILITY_SET',
  payload: visible,
});

export const setHeaderProps = props => ({
  type: 'LAYOUT_HEADER_PROPS_SET',
  payload: props || {},
});

export const setSidebarProps = props => ({
  type: 'LAYOUT_SIDEBAR_PROPS_SET',
  payload: props || {},
});

export const setSidebarRightProps = props => ({
  type: 'LAYOUT_SIDEBAR_RIGHT_PROPS_SET',
  payload: props || {},
});

export const setAppName = appName => ({
  type: 'APP_NAME_SET',
  payload: appName,
});

export const fetchPublicLayoutsSuccess = layouts => ({
  type: FETCH_PUBLIC_LAYOUTS_SUCCESS,
  payload: layouts,
});

export const fetchPublicLayoutsFailure = error => ({
  type: FETCH_PUBLIC_LAYOUTS_FAILURE,
  payload: error,
});
