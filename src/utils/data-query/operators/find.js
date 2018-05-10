/* Import all of the find operators */
import * as findOperators from './findOperators';

const VALID_OPERATORS = Object.keys( findOperators );

export default ( data, options ) => {
  /* Get the query and other options */
  const { query, projection } = options;

  /* Make sure that a query was provided */
  if ( !query ) {
    throw new Error( 'A query object must be provided' );
  }

  const output = arrayMatch( data, query );

  /* Apply the projection if it is applied */
  if ( projection ) {
    return output.map( item => {
      const output = {};
      Object.keys( projection ).forEach( key => {
        output[key] = item[key];
      });

      return output;
    });
  }

  return output;
};

const doesValueMatch = ( key, actualValue, expectedValue ) => {
  /* Check whether the query is actually a set of operators */
  if ( isOperatorObject( expectedValue )) {
    return matchesOperators( actualValue, expectedValue );
  }

  switch ( typeof( expectedValue )) {
    case 'object':
      return ( typeof( actualValue ) === 'object' && actualValue.length ) ? arrayMatch( actualValue, expectedValue ).length > 0 : objectMatch( actualValue, expectedValue );
    default:
      return valueCompare( actualValue, expectedValue );
  }
};

const arrayMatch = ( data, query ) => {
  /* Filter the output */
  const output = data.filter( item => {
    return objectMatch( item, query );
  });

  return output;
};

const objectMatch = ( item, query ) => {
  /* Get all of the keys for the query */
  const queryKeys = Object.keys( query );
  return !queryKeys.filter( queryKey => {
    const expectedValue = query[queryKey];
    return !doesValueMatch( queryKey, item[queryKey], expectedValue );
  }).length;
};

const valueCompare = ( actual, expected ) => {
  return actual === expected;
};

const isOperatorObject = object => {
  return Object.keys( object ).find( operator => VALID_OPERATORS.includes( operator ));
};

const matchesOperators = ( value, operators ) => {
  /* Get all of the operators that are used */
  return !Object.keys( operators ).find( key => {
    return !findOperators[key]( value, operators[key], matchesOperators );
  });
};
