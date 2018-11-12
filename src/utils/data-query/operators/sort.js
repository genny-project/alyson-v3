import dlv from 'dlv';
import { isArray } from '../../../utils';

export default ( data, options ) => {
  if ( !data || data.length == null ) {
    return data;
  }

  const { direction, by } = options;

  const compare = ( itemA, itemB, paths, index ) => {
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
      return compare( itemA, itemB, paths, index + 1 );
    }

    /* otherwise, compare the values */
    return a < b ? 1 : -1 ;
  };

  const sort = ( paths ) => {
    data.sort(( a, b ) => {
      /* determine sort direction */
      return direction === 'desc'
        ? compare( a, b, paths, 0 )
        : compare( b, a, paths, 0 );
    });
  };

  /* if only one sort criteria, turn it into an array so we
  don't have to check again if item is array or not */
  sort( isArray( by ) ? by : [by] );

  return data;
};
