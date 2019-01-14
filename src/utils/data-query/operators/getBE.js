import copy from 'fast-copy';
import { injectContext } from './helpers';
import { isArray, isObject, isString } from '../../../utils';

export default ( data, options, allData ) => {
  // if ( isArray( data )) console.log( '-', data, data.length );

  if ( !data )
    return data;

  return !isArray( data )
    ? lookupBE( data, options, allData )
    : data.reduce(( result, item ) => {
      // console.log( '- -', item );

      const be = lookupBE( item, options, allData );

      // console.log( '- -', be );

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
  // console.log( '- - -', 'data', data );
  const lookupKey = (
    isString( data ) ? data
    : isObject( data ) ? injectContext( options.id, data )
    : null
  );

  // console.log( '- - -', 'lookupKey', lookupKey );

  if ( !lookupKey )
    return;

  /* Create the path to the base entity */
  const be = copy( allData.baseEntities.data[lookupKey] );

  // console.log( '- - -', 'be', be );

  if ( be === undefined )
    return;

  if (
    options.filterOutEmpty && (
      !be ||
      !be.name ||
      !be.code
    )
  ) {
    return undefined;
  }

  // console.log( '- - -', 'is  array?', isArray( be ), typeof be );

  return options.as ? { ...data, [options.as]: be } : be;
};
