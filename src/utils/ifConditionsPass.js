import dlv from 'dlv';
import { doesValueMatch, isOperatorObject } from '../utils/data-query/operators/find';
import { isObject, isArray, isString, curlyBracketParse } from '../utils';

/**
 * Given a condition and a pool of data, perform a query and return the result.
 */
function ifConditionsPass( condition, data ) {
  /**
   * Loop through all of the keys in the condition query and see whether
   * any of them don't match
   */
  if ( !isObject( condition ) && !isArray( condition )) {
    console.error( condition );
  }

  if ( isOperatorObject( condition )) {
    return doesValueMatch( true, condition, data );
  }

  const fields = Object.keys( condition );

  for ( let i = 0; i < fields.length; i++ ) {
    const field = fields[i];
    let contextedField = field;
    let contextedValue = condition[field];

    if ( field.includes( '{{' )) {
      contextedField = curlyBracketParse( field, data );
    }

    if ( isString( contextedValue )) {
      if ( contextedValue.includes( '{{' )) {
        contextedValue = curlyBracketParse( contextedValue, data );
      }
      else if ( contextedValue.startsWith( '_' )) {
        contextedValue = dlv( data, contextedValue.substring( 1 ));
      }
    }

    /**
     * Each key is actually a path to a field in the context, so use dlv to
     * get the actual value */
    const actualValue = dlv( data, contextedField );

    if ( !actualValue ) {
      return false;
    }

    /**
     * Use the doesValueMatch function from the find data query operator to ensure
     * that the value, inside the context at the specified path, matches against
     * either:
     * - An explict value, like another string, or alternatively against a condition
     * - Or an object based on the MongoDB query syntax.
     */
    if ( !doesValueMatch( actualValue, contextedValue, data )) {
      return false;
    }
  }

  return true;
}

export default ifConditionsPass;
