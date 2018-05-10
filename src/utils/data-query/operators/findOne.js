import find from './find';

export default ( data, options ) => {
  const result = find( data, options );
  return result && result.length ? result[0] : null;
};
