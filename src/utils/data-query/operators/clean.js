export default ( data, options ) => {
  const { fields } = options;

  if ( !data ) return null;
  
  return fields
  .map( key => ({ key, data: data[key] }))
  .reduce(( result, current ) => {
    result[current.key] = current.data;

    return result;
  }, {});
};
