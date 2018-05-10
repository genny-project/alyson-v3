import dlv from 'dlv';

export default ( value, context ) => {
  if ( typeof( value ) !== 'string' ) {
    return value;
  }

  return curlyBracketParse( value, path => {
    return dlv( context, path );
  });
};

const curlyBracketParse = ( input, method ) => {
  return input.split( '{{' ).map( i => i.includes( '}}' ) ? method( i.split( '}}' )[0] ) : i ).join( '' );
};
