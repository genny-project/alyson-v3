import dlv from 'dlv';
import { isArray, isObject } from '../../../../utils';
import { doesValueMatch, isOperatorObject } from '../../../../utils/data-query/operators/find';
import { store } from '../../../../redux';

const ifConditionsPass = ( context, condition ) => {
  const { user } = store.getState().vertx;

  const dataPool = {
    user,
    props: this.props,
    ...context,
  };

  /**
   * Loop through all of the keys in the condition query and see whether
   * any of them don't match
   */
  if ( !isObject( condition ) && !isArray( condition )) {
    console.error( condition );
  }

  if ( isOperatorObject( condition )) {
    return doesValueMatch( true, condition, dataPool );
  }

  const fields = Object.keys( condition );

  for ( let i = 0; i < fields.length; i++ ) {
    const field = fields[i];
    let contextedField = field;
    let contextedValue = condition[field];

    if ( field.includes( '{{' )) {
      contextedField = this.curlyBracketParse( field );
    }

    if ( typeof contextedValue === 'string' && contextedValue.includes( '{{' )) {
      contextedValue = this.curlyBracketParse( contextedValue );
    }

    /**
     * Each key is actually a path to a field in the context, so use dlv to
     * get the actual value */
    const actualValue = dlv( dataPool, contextedField );

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
    if ( !doesValueMatch( actualValue, contextedValue, dataPool )) {
      return false;
    }
  }

  return true;
};

export default ifConditionsPass;
