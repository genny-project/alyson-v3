import dlv from 'dlv';
import { store } from '../../../redux';
import DataQuery from '../../data-query';

/* Returns the length of the data provided */
export default ( data, options, allData, context ) => {
  const { params, name } = options;
  const { layouts } = store.getState().vertx;
  const query = dlv( layouts, `queries.${name}.query` );

  if ( !query ) return data;

  const output = new DataQuery( data ).query( query, {
    ...context,
    ...data,
    params: params,
  });

  return output;
};
