import * as Operators from './operators';
import dlv from 'dlv';

class DataQuery {
  constructor( data, datastore ) {
    /* Check that the data provided to the object is an array */
    if ( !Array.isArray( data )) {
      throw new Error( 'Data provided to a data query must be an array' );
    }

    this.data = data;
    this.datastore = datastore ? datastore : data;
  }

  /* Queries the data and returns the result */
  query( query ) {
    /* Create a copy of the data */
    let output = [...this.data];

    /* Apply each of the operators to the data */
    query.forEach( q => {
      output = Operators[q.operator]( output, q, this.datastore );
    });

    return output;
  }
}

export default DataQuery;
