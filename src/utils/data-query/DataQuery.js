import * as Operators from './operators';

class DataQuery {
  constructor( data ) {
    /* Check that the data provided to the object is an array */
    if ( !Array.isArray( data )) {
      throw new Error( 'Data provided to a data query must be an array' );
    }

    this.data = data;
  }

  /* Queries the data and returns the result */
  query( query ) {
    /* Create a copy of the data */
    let output = [...this.data];

    /* Apply each of the operators to the data */
    query.forEach( q => {
      if ( q.as ) {
        output = {
          ...output,
          [q.as]: Operators[q.operator]( output, q ),
        };
        return;
      }

      output = Operators[q.operator]( output, q );
    });

    return output;
  }
}

export default DataQuery;
