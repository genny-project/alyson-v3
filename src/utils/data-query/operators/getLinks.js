import copy from 'fast-copy';
import { injectContext } from './helpers';
import { isArray, isObject } from '../../../utils';

export default ( data, options, allData ) => {
  if ( !data )
    return data;

  return !isArray( data )
    ? lookupLink( data, options, allData )
    : data.reduce(( result, item ) => {
      const be = lookupLink( item, options, allData );

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

const lookupLink = ( data, options, allData ) => {
  if ( !isObject( data ))
    return;

  /* Create the path to the base entity */
  const be = copy( allData.baseEntities.links[injectContext( options.id, data )] );
  const links = be ? be.links : be;

  if (
    options.filterOutEmpty && (
      !be ||
      !be.links
    )
  ) {
    return undefined;
  }

  return options.as ? { ...data, [options.as]: links } : links;
};
