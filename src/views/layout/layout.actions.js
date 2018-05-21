export const setSidebarVisibility = visible => ({
  type: 'LAYOUT_SIDEBAR_VISIBILITY_SET',
  payload: visible,
});

export const setHeaderVisibility = visible => ({
  type: 'LAYOUT_HEADER_VISIBILITY_SET',
  payload: visible,
});
