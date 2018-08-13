export const addComponentTheme = ( componentName, themeName, theme ) => ({
  type: 'THEME_COMPONENT_THEME_ADD',
  payload: {
    componentName,
    themeName,
    theme,
  },
});

export const addComponentConfig = ( componentName, config ) => ({
  type: 'THEME_COMPONENT_THEME_ADD',
  payload: {
    componentName,
    themeName: 'config',
    theme: config,
  },
});
