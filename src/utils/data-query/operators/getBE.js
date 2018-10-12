import copy from 'fast-copy';
import { injectContext } from './helpers';
import { isArray, isObject, isString } from '../../../utils';

export default ( data, options, allData ) => {
  if ( !data )
    return data;

  return !isArray( data )
    ? lookupBE( data, options, allData )
    : data.reduce(( result, item ) => {
      const be = lookupBE( item, options, allData );

      if (
        options.filterOutEmpty &&
        be === undefined
      ) {
        return result;
      }

      result.push( be );

      return result;
    }, [] );
};

const lookupBE = ( data, options, allData ) => {
  const lookupKey = (
    isString( data ) ? data
    : isObject( data ) ? injectContext( options.id, data )
    : null
  );

  if ( !lookupKey )
    return;

  /* Create the path to the base entity */
  const be = copy( allData.baseEntities.data[lookupKey] );

  if (
    options.filterOutEmpty && (
      !be ||
      !be.name ||
      !be.code
    )
  ) {
    return undefined;
  }

  return options.as ? { ...data, [options.as]: be } : be;
};
