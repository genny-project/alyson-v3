import dlv from 'dlv';
import { isArray, isString } from '../../../utils';

export default ( data, options ) => {
  if ( !data ) {
    return data;
  }

  const { include, exclude, field } = options;

  if ( !isArray( data ))
    return data;

  return data.filter( i => {
    const item = dlv( i, field );

    if (
      isArray( include ) &&
      !include.includes( item )
    ) {
      return false;
    }

    if (
      isString( include ) &&
      include !== item
    ) {
      return false;
    }

    if (
      isArray( exclude ) &&
      exclude.includes( item )
    ) {
      return false;
    }

    if (
      isString( exclude ) &&
      exclude === item
    ) {
      return false;
    }

    return true;
  });
};
