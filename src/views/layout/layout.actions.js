export const setSidebarVisibility = visible => ({
  type: 'LAYOUT_SIDEBAR_VISIBILITY_SET',
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

export const setAppName = appName => ({
  type: 'APP_NAME_SET',
  payload: appName,
});
