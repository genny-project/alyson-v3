export default ( input, value, matchesOperators ) => {
  return value.filter( operators => matchesOperators( input, operators )).length === 0;
};
