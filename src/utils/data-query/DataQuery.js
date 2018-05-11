import * as Operators from './operators';
import dlv from 'dlv';
import dset from 'dset';

class DataQuery {
  constructor( data ) {
    this.data = data;
    this.path = null;
  }

  /* Queries the data and returns the result */
  query( query ) {
    /* Create a copy of the data */
    let output = this.data.length ? [...this.data] : { ...this.data };
    output = JSON.parse( JSON.stringify( output ));

    /* Apply each of the operators to the data */
    query.forEach( q => {
      if ( q.operator === 'navigate' ) {
        this.path = q.path;
        return;
      }

      const result = Operators[q.operator]( this.path ? dlv( output, this.path ) : output, q, this.data.length ? [...this.data] : { ...this.data });
      if ( this.path ) {
        dset( output, this.path, result );
      } else {
        output = result;
      }
    });

    return output;
  }
}

export default DataQuery;
