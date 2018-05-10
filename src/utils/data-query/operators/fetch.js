import find from './find';

export default ( data, options, allData ) => {
  const { as, ...restOptions } = options;
  return data.map( item => ({
    ...item,
    ...( as ? { [ as ]: find( allData, { ...restOptions, context: item }) } : find( allData, { ...restOptions, context: item })),
  }));
};
