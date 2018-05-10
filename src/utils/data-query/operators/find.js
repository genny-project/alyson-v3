export default ( data, options ) => {
  /* Get the query */
  const { query } = options;

  /* Make sure that a query was provided */
  if ( !query ) {
    throw new Error( 'A query object must be provided' );
  }

  /* Get all of the keys for the query */
  const queryKeys = Object.keys( query );

  return data.filter( item => {
    /* Loop through each query key */
    for ( let i = 0; i < queryKeys.length; i++ ) {
      const expectedValue = query[queryKeys[i]];

      if ( item[queryKeys[i]] !== expectedValue ) {
        return false;
      }
    }

    return true;
  });
};
