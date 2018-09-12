import copy from 'fast-copy';
import { injectContext } from './helpers';
import { isArray, isObject } from '../../../utils';

export default ( data, options, allData ) => {
  if ( !data )
    return data;

  return !isArray( data )
    ? lookupBE( data, options, allData )
    : data.reduce(( result, item ) => {
      const be = lookupBE( item, options, allData );

      if ( be === -1 )
        return result;

      result.push( be );

      return result;
    }, [] );
};

const lookupBE = ( data, options, allData ) => {
  if ( !isObject( data ))
    return;

  /* Create the path to the base entity */
  const be = copy( allData.baseEntities.data[injectContext( options.id, data )] );

  if ( !be )
    return -1;

  return options.as ? { ...data, [options.as]: be } : be;
};
