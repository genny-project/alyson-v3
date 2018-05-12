import { injectContext } from './helpers';

export default ( data, options, allData ) => {
  if (
    !data ||
    !( data instanceof Array )
  ) {
    return data;
  }

  return data.length
    ? data.map( item => lookupBE( item, options, allData ))
    : lookupBE( data, options, allData );
};

const lookupBE = ( data, options, allData ) => {
  /* Create the path to the base entity */
  const be = allData.baseEntities.data[injectContext( options.id, data )];

  return options.as
    ? { ...data, [options.as]: be }
    : be;
};
