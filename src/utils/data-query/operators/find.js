/* Import all of the find operators */
import * as findOperators from './findOperators';
import { injectContext } from './helpers';

const VALID_OPERATORS = Object.keys( findOperators );

export default ( data, options ) => {
  /* Get the query and other options */
  const { query, projection, context, single } = options;

  /* Make sure that a query was provided */
  if ( !query ) {
    throw new Error( 'A query object must be provided' );
  }

  const output = arrayMatch( data, query, context );

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

  return single ? output[0] : output;
};

const doesValueMatch = ( key, actualValue, expectedValue, context ) => {
  /* Check whether the query is actually a set of operators */
  if ( isOperatorObject( expectedValue )) {
    return matchesOperators( actualValue, expectedValue );
  }

  switch ( typeof( expectedValue )) {
    case 'object':
      return ( typeof( actualValue ) === 'object' && actualValue.length ) ? arrayMatch( actualValue, expectedValue, context ).length > 0 : objectMatch( actualValue, expectedValue, context );
    default:
      return valueCompare( actualValue, expectedValue );
  }
};

const arrayMatch = ( data, query, context ) => {
  /* Filter the output */
  const output = data.filter( item => {
    return objectMatch( item, query, context );
  });

  return output;
};

const objectMatch = ( item, query, context ) => {
  /* Get all of the keys for the query */
  const queryKeys = Object.keys( query );
  return !queryKeys.filter( queryKey => {
    const expectedValue = context ? injectContext( query[queryKey], context ) : query[queryKey];
    return !doesValueMatch( queryKey, item[queryKey], expectedValue, context );
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
