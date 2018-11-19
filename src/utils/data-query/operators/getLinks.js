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

  const { id, as, onlyIncludeIf, excludeIf, filterOutEmpty } = options;
  const newPath = as;

  /* Create the path to the base entity */
  const be = copy( allData.baseEntities.links[injectContext( id, data )] );

  let baseEntityLinks = undefined;

  if ( be != null ) {
    baseEntityLinks = Object.keys( be ).reduce(( result, item ) => {
      let keyData = be[item];

      if (
        isArray( onlyIncludeIf )
      )  {
        keyData = keyData.filter( link => {
          return onlyIncludeIf.every( x => {
            return link[x.path] === x.value;
          });
        });
      }

      if (
        isArray( excludeIf )
      )  {
        keyData = keyData.filter( link => {
          return !excludeIf.some( x => {
            return link[x.path] === x.value;
          });
        });
      }

      keyData.forEach( item  => {
        if ( result.filter( x => x.link.targetCode === item.link.targetCode ) < 1 ) {
          result.push( item );
        }
      });

      return result;
    }, [] );
  }

  const links = baseEntityLinks ? baseEntityLinks : be;

  if (
    filterOutEmpty && (
      !be ||
      !baseEntityLinks
    )
  ) {
    return undefined;
  }

  return newPath ? { ...data, [newPath]: links } : links;
};
