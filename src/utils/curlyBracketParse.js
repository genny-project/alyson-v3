import dlv from 'dlv';

function handleMapCurlyTemplate( data ) {
  return function ( template ) {
    if ( !template || !template.includes( '}}' )) {
      return template;
    }

    const splitTemplate = template.split( '}}' );
    const path = splitTemplate[0];

    const textAfterTemplate = splitTemplate.slice( 1 );
    const resolved = dlv( data, path );

    return `${resolved}${textAfterTemplate}`;
  };
}

function curlyBracketParse( string, data ) {
  return String( string )
    .split( '{{' )
    .map( handleMapCurlyTemplate( data ))
    .join( '' );
}

export default curlyBracketParse;
