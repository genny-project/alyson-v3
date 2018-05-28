const getBasePath = navigation => {
  if ( !navigation )
    return null;

  const { layout } = navigation.state.params;

  if (
    !layout ||
    typeof layout !== 'string'
  ) {
    return null;
  }

  if ( !layout.startsWith( '/' ))
    return `/${layout}`;

  return layout;
};

export default {
  getBasePath,
};
