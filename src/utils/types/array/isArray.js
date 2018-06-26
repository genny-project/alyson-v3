const isArray = ( array, options = {}) => {
  const {
    ofMaxLength,
    ofMinLength,
    ofExactLength ,
  } = options;

  /* Ensure a valid array is given. */
  if (
    array == null ||
    !( array instanceof Array )
  ) {
    return false;
  }

  /* Test the exact length of the array if given. */
  if ( ofExactLength != null )
    return array.length === ofExactLength;

  /* Test the min (and max if given) length the array can be. */
  if ( ofMinLength != null ) {
    if ( ofMaxLength != null ) {
      return (
        array.length >= ofMinLength &&
        array.length <= ofMaxLength
      );
    }

    return array.length >= ofMinLength;
  }

  /* Test the max length the array can be. */
  if ( ofMaxLength != null )
    return array.length <= ofMaxLength;

  /* If the array is valid and no options were passed, return as valid. */
  return true;
};

export default isArray;
