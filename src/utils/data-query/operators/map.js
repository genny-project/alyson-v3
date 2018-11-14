import dlv from 'dlv';
import { injectContext } from './helpers';

export default ( data, options ) => {
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
      const value = fields[current] === '.' ? item : dlv( item, fields[current] ) != null ? dlv( item, fields[current] ) : [];

      return {
        ...result,
        [key]: value,
      };
    }, {})),
  }));
};
