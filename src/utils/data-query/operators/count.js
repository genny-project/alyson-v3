import find from './find';

/* Returns the length of the data provided */
export default ( data, options ) => {
  const { query } = options;

  if ( !data ) return null;
  if ( query ) {
    /* First filter the data then return the count */
    return find( data, options ).length;
  }

  return data.length;
};
