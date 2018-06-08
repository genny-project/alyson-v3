const recursivelyRemove = string => {
  if ( string.startsWith( '/' )) {
    return recursivelyRemove(
      string.substr( 1 )
    );
  }

  if ( string.endsWith( '/' )) {
    return recursivelyRemove(
      string.substr( 0, string.length - 1 )
    );
  }

  return string;
};

const removeStartingAndEndingSlashes = string => {
  if ( typeof string !== 'string' )
    return string;

  return recursivelyRemove( string );
};

export default removeStartingAndEndingSlashes;
