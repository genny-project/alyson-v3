import copy from 'fast-copy';

export default ( data, options, allData ) => {
  /* Resolve the alias */
  const aliasValue  = allData.aliases[options.alias];

  /* Create the path to the base entity */
  const be = copy( allData.baseEntities.data[aliasValue] );

  return options.as ? { ...data, [options.as]: be } : be;
};
