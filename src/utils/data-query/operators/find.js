export default ( data, options ) => {
  /* Get the query and other options */
  const { query, projection } = options;

  /* Make sure that a query was provided */
  if ( !query ) {
    throw new Error( 'A query object must be provided' );
  }

  /* Get all of the keys for the query */
  const queryKeys = Object.keys( query );

  /* Filter the output */
  const output = data.filter( item => {
    /* Loop through each query key */
    for ( let i = 0; i < queryKeys.length; i++ ) {
      const expectedValue = query[queryKeys[i]];

      if ( item[queryKeys[i]] !== expectedValue ) {
        return false;
      }
    }

    return true;
  });

  /* Apply the projection if it is applied */
  if ( projection ) {
    return output.map( item => {
      const output = {};
      Object.keys( projection ).forEach( key => {
        output[key] = item[key];
      });

      return output;
    });
  }

  return output;
};
