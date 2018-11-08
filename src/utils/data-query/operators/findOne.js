import dlv from 'dlv';
import find from './find';

export default ( data, options, allData, context ) => {
  let theData = data;

  if ( options.global ) {
    theData = context;
    if ( options.path ) {
      theData = dlv( theData, options.path );
    }
  }

  const result = find( theData, options, allData, data );

  return result && Array.isArray( result ) ? result[0] : null;
};
