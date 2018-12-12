import dlv from 'dlv';
import { isString, isArray, isObject } from '../../../../utils';

const injectContext = ( value, context ) => {
  if (
    isString( value ) &&
    shouldParseBrackets( value )
  ) {
    return curlyBracketParse( value, path => dlv( context, path ));
  }

  if (
    isString( value ) &&
    shouldParseUnderscore( value )
  ) {
    return underscoreParse( value, context );
  }

  /* If given an array, recursively map through its
   * elements and inject context into them. */
  if ( isArray( value, { ofMinLength: 1 })) {
    return value.map( val => injectContext( val, context ));
  }

  /* If given an object, recursively loop through the keys and inject context. */
  if ( isObject( value )) {
    const values = Object.keys( value );

    const reduced = values.reduce(( resultant, key ) => {
      /* If the key appears to be a template, parse it. */
      const updatedKey = shouldParseBrackets( key )
        ? curlyBracketParse( key, path => dlv( context, path ))
        : key;

      /* Inject context into the object value, set to the appropriate
       * key (the parsed or the normal key). */
      resultant[updatedKey] = injectContext( value[key], context );

      return resultant;
    }, {});

    return reduced;
  }

  return value;
};

const shouldParseBrackets = string => {
  return (
    isString( string, { ofMinLength: 1 }) &&
    string.includes( '{{' ) &&
    string.includes( '}}' )
  );
};

const curlyBracketParse = ( input, method ) => {
  return input.split( '{{' ).map( i => i.includes( '}}' )
    ? `${method( i.split( '}}' )[0] ) != null
      ? method( i.split( '}}' )[0] )
      : input}${i.split( '}}' ).slice( 1 )}`
    : i ).join( '' );
};

const shouldParseUnderscore = string => {
  return (
    isString( string, { ofMinLength: 1 }) &&
    string.startsWith( '_' )
  );
};

const underscoreParse = ( input, context ) => {
  return dlv( context, input.split( '_' )[1] );
};

export default injectContext;
