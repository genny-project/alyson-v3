import dlv from 'dlv';
import dset from 'dset';
import { isArray } from '../../../utils';
import * as operators from './';
import { injectContext } from './helpers';

export default ( data, options, allData, context ) => {
  return isArray( data ) ? data.map( item => {
    return getSingleItemScoped( item, options, allData, context );
  }) : getSingleItemScoped( data, options, allData, context );
};

const getSingleItemScoped = ( item, options, allData, context ) => {
  const { scope, path, as } = options;

  /* Create a copy of the object that we can modify */
  const result = { ...item };

  /* Get the data for the path */
  const pathData = dlv({ ...result, ...context } , path );

  // console.warn({ allData, pathData, result });

  /* Get the scope operator */
  const { operator } = scope;

  /* Run the operator on the path data */
  const processed = operators[operator]( pathData, scope, allData );

  const destination = as ? injectContext( as, { ...item, ...context }) : path;

  /* Place the processed data back at the path */
  dset( result, destination, processed );

  return result;
};
