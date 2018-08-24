import dlv from 'dlv';

const handleMap = options => item => dlv( item, options.field );
const handleReduce = ( result, current ) => ({ ...result, [current]: true });

export default ( data, options ) => {
  if ( !data || typeof data !== 'object' ) {
    return {};
  }

  return Object
    .keys( data.map( handleMap( options ))
    .reduce( handleReduce, {}));
};
