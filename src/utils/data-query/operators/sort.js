export default ( data, options ) => {
  if (
    !data ||
    data.length == null
  ) {
    return data;
  }

  const { direction, by } = options;

  direction === 'desc'
    ? data.sort(( a, b ) => b[by] - a[by] )
    : data.sort(( a, b ) => a[by] - b[by] );

  return data;
};
