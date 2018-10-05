import dlv from 'dlv';
import dset from 'dset';
import * as Operators from './operators';
import { injectContext, ifConditionsPass } from './operators/helpers';

class DataQuery {
  constructor( data ) {
    this.data = data;
    this.path = null;
  }

  /* Queries the data and returns the result */
  query( query, queryContext ) {
    /* Create a copy of the data */
    let output = this.data.length ? [...this.data] : { ...this.data };

    /* Inject the queryContext into the data passed into the operator */
    output = JSON.parse( JSON.stringify( output ));

    let currentContext = {};

    const checkQuery = ( query ) => {
      query.forEach( q => {
        if ( q.onlyShowIf ) {
          if (
            !ifConditionsPass({ ...queryContext, ...currentContext }, q.onlyShowIf,  ) || !q.query
          ) return null;
          checkQuery( q.query );

          return;
        }

        if ( q.dontShowIf ) {
          if (
            ifConditionsPass({ ...queryContext, ...currentContext }, q.dontShowIf,  ) || !q.query
          ) return null;
          checkQuery( q.query );

          return;
        }

        if ( q.operator === 'navigate' ) {
          this.path = q.path;

          return;
        }
        const queryData = this.injectQueryContext( q, { ...queryContext, ...currentContext });

        const result = Operators[q.operator](
          this.path ? dlv( output, this.path ) : output,
          queryData,
          this.data.length ? [...this.data] : { ...this.data },
          queryContext
        );

        if ( this.path ) {
          dset( output, this.path, result );
        } else {
          output = result;
        }

        // set the currentContext to be the most recent output object of the query array
        currentContext = output;
      });
    };

    /* Apply each of the operators to the data */
    checkQuery( query );

    return output;
  }

  injectQueryContext( data, context ) {
    if ( data.length ) {
      return data;
    }

    const output = {};

    Object.keys( data ).forEach( key => {
      output[key] = injectContext( data[key], context );
    });

    return output;
  }
}

export default DataQuery;
