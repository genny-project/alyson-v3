import dlv from 'dlv';
import copy from 'fast-copy';
import { curlyBracketParse, isObject, isString, isArray } from '../utils';
import { Recursive } from '../views/components';

function handleReducePropInjection( data ) {
  return ( result, current, index ) => {
    if (
      result[current] == null &&
      result[index] == null
    ) {
      return result;
    }

    if ( isString( current, { startsWith: 'render' })) {
      return result;
    }

    if ( isString( result[current] )) {
      if ( result[current].startsWith( '_' )) {
        if ( result[current].includes( '{{' )) {
          result[current] = curlyBracketParse( result[current] );
        }

        result[current] = dlv( data, result[current].substring( 1 ));

        return result;
      }

      if ( result[current].includes( '{{' )) {
        result[current] = curlyBracketParse( result[current] );

        return result;
      }

      return result;
    }

    if ( isArray( result[current] )) {
      result[current] = result[current].reduce( handleReducePropInjection, result[current] );

      return result;
    }

    if ( isObject( result[current] ) || isObject( current )) {
      const targetObject = isObject( result[current] )  ? result[current] : current;
      const keys = Object.keys( targetObject );

      if ( result[current] && result[current].renderAsComponent ) {
        result[current] = <Recursive {...result[current]} />;

        return result;
      }

      if ( result[current] ) {
        result[current] = keys.reduce( handleReducePropInjection, result[current] );
      } else {
        result[index] = keys.reduce( handleReducePropInjection, result[index] );
      }
      // console.warn( 'Result', result );

      return result;
    }

    return result;
  };
}

/**
 * Loops through all of the props for this element and inject the data if required.
 * Additionally parse a handlebars style string and inject variables from the data if needed.
 * If the prop is not a string, simply return its current value so that functions work
 * correctly.
 */
function injectDataIntoProps( props, data ) {
  if ( !isObject( props )) return {};

  const propsCopy = copy( props );
  let afterProps;

  try {
    afterProps = Object.keys( propsCopy ).reduce( handleReducePropInjection( data ), propsCopy );
  }
  catch ( error ) {
    //
  }

  return afterProps;
}

export default injectDataIntoProps;
