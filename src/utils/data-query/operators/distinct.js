import dlv from 'dlv';

export default ( data, options ) => {
  return Object.keys( data.map( item => dlv( item, options.field )).reduce(( result, current ) => ({ ...result, [ current ]: true }), {}));
};
