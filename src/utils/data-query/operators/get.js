import dlv from 'dlv';

export default ( data, options ) => {
  return options.as
    ? { ...data, [options.as]: dlv( data, options.path ) }
    : dlv( data, options.path );
};
