const removeStartingAndEndingSlashes = string => {
  if (
    typeof string !== 'string' ||
    string.length === 0
  ) {
    return string;
  }

  if ( string === '/' )
    return '';

  if (
    string.startsWith( '/' ) &&
    string.endsWith( '/' )
  ) {
    return string.substr( 1, string.length - 2 );
  }

  if ( string.startsWith( '/' ))
    return string.substr( 1, string.length - 1 );

  if ( string.endsWith( '/' ))
    return string.substr( 0, string.length - 2 );

  return string;
};

export default removeStartingAndEndingSlashes;
