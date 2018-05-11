import dlv from 'dlv';

export default ( data, options ) => {
  const { fields, append } = options;

  if ( typeof( fields ) === 'string' ) {
    return data.length ? data.map( item => dlv( item, fields )) : dlv( data, fields ) || [];
  }

  return data.map( item => ({
    ...( append ? item : {}),
    ...( Object.keys( fields ).reduce(( result, current ) => ({
      ...result,
      [current]: dlv( item, fields[current] ) || [],
    }), {})),
  }));
};
