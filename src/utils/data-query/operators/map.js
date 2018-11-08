import dlv from 'dlv';
import { injectContext } from './helpers';
import * as operators from './';

export default ( data, options, allData, theContext ) => {
  if ( !data ) {
    return data;
  }

  const { fields, append, context } = options;

  if ( typeof( fields ) === 'string' ) {
    return data.length ? data.map( item => dlv( item, fields )) : dlv( data, fields ) || [];
  }

  if ( !Array.isArray( data )) {
    return data;
  }

  if ( !fields || typeof fields !== 'object' ) {
    return data;
  }

  return data.map( item => ({
    ...( append ? item : {}),
    ...( Object.keys( fields ).reduce(( result, current ) => {
      const key = injectContext( current, { ...context, ...item });
      let value = null;

      if ( fields[key] && fields[key].operator ) {
        /* Run the operator on the path data */
        value = operators[fields[key].operator]( item, fields[key], allData, theContext );
      } else {
        value = fields[current] === '.' ? item : dlv( item, fields[current] ) || [];
      }

      return {
        ...result,
        [key]: value,
      };
    }, {})),
  }));
};
