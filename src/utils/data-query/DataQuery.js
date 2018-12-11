import dlv from 'dlv';
import dset from 'dset';
import copy from 'fast-copy';
import { isArray } from '../../utils';
import * as Operators from './operators';
import { injectContext, ifConditionsPass } from './operators/helpers';

class DataQuery {
  constructor( data ) {
    this.data = data;
    this.path = null;
  }

  /* Queries the data and returns the result */
  query( query, queryContext = {}) {
    if ( !isArray( query, { ofMinLength: 1 }))
      return {};

    /* Create a copy of the data */
    let output = copy( this.data );

    const checkQuery = q => {
      for ( let i = 0; i < q.length; i++ ) {
        const query = q[i];

        if ( query.query ) {
          if ( query.onlyShowIf ) {
            if ( ifConditionsPass( queryContext, query.onlyShowIf )) {
              checkQuery( query.query );
            }
            else break;
          }
          else if ( query.dontShowIf ) {
            if ( !ifConditionsPass( queryContext, query.dontShowIf )) {
              checkQuery( query.query );
            }
            else break;
          }
        }

        if ( query.operator === 'navigate' ) {
          this.path = query.path;

          return;
        }

        const queryData = this.injectQueryContext( query, queryContext );

        const result = Operators[query.operator](
          this.path ? dlv( output, this.path ) : output,
          queryData,
          copy( this.data ),
          queryContext
        );

        if ( this.path ) {
          dset( output, this.path, result );
        } else {
          output = result;
        }
      }
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
