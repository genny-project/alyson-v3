export const loadDevLayouts = layouts => ({
  type: 'LOAD_DEV_LAYOUTS',
  payload: layouts,
});

export const clearAllLayouts = () => ({
  type: 'CLEAR_ALL_LAYOUTS',
});

export const loadDevLayout = payload => ({
  type: 'LOAD_DEV_LAYOUT',
  payload,
});

