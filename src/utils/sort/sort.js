import dlv from 'dlv';
import { isArray, isObject  } from '../../utils';

const sort = ( array, options = {}) => {
  const {
    paths,
    direction,
  } = options;

  /* Ensure a valid array is given. */
  if ( !isArray( array )) {
    return false;
  }

  const compare = ( itemA, itemB, index ) => {
    /* if paths not supplied, do a simple comparison */
    if ( !isObject( paths )) {
      return itemA < itemB ? 1 : -1 ;
    }

    /* fetch the specified field from each item object */
    const a = dlv( itemA, paths[index] );
    const b = dlv( itemB, paths[index] );

    /* if one field doesn't exist, the other is weighted */
    if ( a == null && b != null ) return -1;
    if ( a != null && b == null ) return 1;

    /* if both fields are the same, check if there are other
    sort criteria left in the array */
    if (
      a === b &&
      paths.length > 1 &&
      paths.length > index + 1
    ) {
      return compare( itemA, itemB, index + 1 );
    }

    /* otherwise, compare the values */
    return a < b ? 1 : -1 ;
  };

  return array.sort(( a, b ) => {
    /* determine sort direction, pass 0 to indicate top level compare */
    return direction === 'desc'
      ? compare( a, b, 0 )
      : compare( b, a, 0 );
  });
};

export default sort;
