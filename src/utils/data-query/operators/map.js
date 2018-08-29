import dlv from 'dlv';

export default ( data, options ) => {
  if ( !data ) {
    return data;
  }

  const { fields, append } = options;

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
    ...( Object.keys( fields ).reduce(( result, current ) => ({
      ...result,
      [current]: dlv( item, fields[current] ) || [],
    }), {})),
  }));
};
