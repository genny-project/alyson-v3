export default ( input, value, doesValueMatch ) => {
  return value.filter( operators => !doesValueMatch( operators )).length === 0;
};
