import * as operators from './';
import dlv from 'dlv';
import dset from 'dset';

export default ( data, options ) => {
  const { scope, path, as } = options;
  return data.map( item => {
    /* Create a copy of the object that we can modify */
    const result = { ...item };

    /* Get the data for the path */
    const pathData = dlv( result, path );

    /* Get the scope operator */
    const { operator } = scope;

    /* Run the operator on the path data */
    const processed = operators[operator]( pathData, scope );

    /* Place the processed data back at the path */
    dset( result, as ? as : path, processed );

    return result;
  });
};
