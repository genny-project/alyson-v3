import find from './find';

export default ( data, options ) => {
  const result = find( data, options );
  return result && Array.isArray( result ) ? result[0] : null;
};
