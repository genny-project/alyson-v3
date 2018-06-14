import dlv from 'dlv';
import dset from 'dset';
import * as Operators from './operators';
import { injectContext } from './operators/helpers';

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

    /* Apply each of the operators to the data */
    query.forEach( q => {
      if ( q.operator === 'navigate' ) {
        this.path = q.path;

        return;
      }

      const queryData = this.injectQueryContext( q, queryContext );
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
    });
    
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
