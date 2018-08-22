const isString = ( string, options = {}) => {
  const {
    ofMaxLength,
    ofMinLength,
    ofExactLength,
    startsWith,
    endsWith,
    includes,
  } = options;

  /* Ensure a valid string is given. */
  if (
    string == null ||
    typeof string !== 'string'
  ) {
    return false;
  }

  /* Test the exact length of the array if given. */
  if ( ofExactLength != null )
    return string.length === ofExactLength;

  /* Test the min (and max if given) length the array can be. */
  if ( ofMinLength != null ) {
    if ( ofMaxLength != null ) {
      return (
        string.length >= ofMinLength &&
        string.length <= ofMaxLength
      );
    }

    return string.length >= ofMinLength;
  }

  /* Test the max length the array can be. */
  if ( ofMaxLength != null )
    return string.length <= ofMaxLength;

  if ( startsWith != null )
    return string.startsWith( startsWith );

  if ( endsWith != null )
    return string.endsWith( endsWith );

  if ( includes != null )
    return string.includes( includes );

  /* If the array is valid and no options were passed, return as valid. */
  return true;
};

export default isString;
