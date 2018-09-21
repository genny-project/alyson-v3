import dlv from 'dlv';
/* Import all of the find operators */
import * as findOperators from './findOperators';
import { injectContext } from './helpers';

const IGNORE_KEYS = ['then', 'else'];
const VALID_OPERATORS = Object.keys( findOperators );

export default ( data, options ) => {
  if ( !data ) {
    return data;
  }

  /* Get the query and other options */
  const { query, projection, context, single } = options;

  /* Make sure that a query was provided */
  if ( !query ) {
    throw new Error( 'A query object must be provided' );
  }

  const output = arrayMatch( data, query, context );

  /* Apply the projection if it is applied */
  if ( projection ) {
    if ( typeof projection !== 'object' ) {
      return data;
    }

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

const doesValueMatch = ( actualValue, expectedValue, context ) => {
  /* Check whether the query is actually a set of operators */
  if ( isOperatorObject( expectedValue )) {
    return matchesOperators( actualValue, expectedValue, context );
  }
  switch ( typeof( expectedValue )) {
    case 'object':
      return ( typeof( actualValue ) === 'object' && actualValue.length ) ? arrayMatch( actualValue, expectedValue, context ).length > 0 : objectMatch( actualValue, expectedValue, context );
    default:
      return valueCompare( actualValue, expectedValue );
  }
};

const arrayMatch = ( data, query, context ) => {
  if ( !Array.isArray( data )) {
    return [];
  }

  /* Filter the output */
  const output = data.filter( item => {
    return objectMatch( item, query, context );
  });

  return output;
};

const objectMatch = ( item, query, context ) => {
  if ( !query || typeof query !== 'object' ) {
    return false;
  }
  /* Get all of the keys for the query, excluding then and else */
  const queryKeys = Object.keys( query ).filter( key => !['then', 'else'].includes( key ));

  const result = !queryKeys.filter( queryKey => {
    const expectedValue = context ? injectContext( query[queryKey], context ) : query[queryKey];

    return !doesValueMatch( dlv( item, queryKey ), expectedValue, context );
  }).length;

  return result;
};

const valueCompare = ( actual, expected ) => {
  return actual === expected;
};

const isOperatorObject = object => {
  if ( !object || typeof object !== 'object' ) {
    return false;
  }

  return Object.keys( object ).filter( key => !['then', 'else'].includes( key )).find( operator => VALID_OPERATORS.includes( operator ));
};

const matchesOperators = ( value, operators, context ) => {
  if ( !operators || typeof operators !== 'object' ) {
    return false;
  }
  /* Get all of the operators that are used */
  const keys = Object.keys( operators );

  return !keys.find( key => {
    /* Skip all ignored keys. */
    if ( IGNORE_KEYS.includes( key ))
      return false;

    /* If context is passed in, attempt to inject context to the value. */
    const operatorValue = context
      ? injectContext( operators[key], context )
      : operators[key];

    return !findOperators[key]( value, operatorValue, matchesOperators );
  });
};

export { doesValueMatch };
