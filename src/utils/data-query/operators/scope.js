import dlv from 'dlv';
import dset from 'dset';
import { isArray } from '../../../utils';
import * as operators from './';

export default ( data, options, allData ) => {
  return isArray( data ) ? data.map( item => {
    return getSingleItemScoped( item, options, allData );
  }) : getSingleItemScoped( data, options, allData );
};

const getSingleItemScoped = ( item, options, allData ) => {
  const { scope, path, as } = options;

  /* Create a copy of the object that we can modify */
  const result = { ...item };

  /* Get the data for the path */
  const pathData = dlv( result, path );

  /* Get the scope operator */
  const { operator } = scope;

  /* Run the operator on the path data */
  const processed = operators[operator]( pathData, scope, allData );

  /* Place the processed data back at the path */
  dset( result, as ? as : path, processed );

  return result;
};
