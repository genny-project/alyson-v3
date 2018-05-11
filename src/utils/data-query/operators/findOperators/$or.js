export default ( input, value, matchesOperators ) => {
  return !!value.find( operators => matchesOperators( input, operators ));
};
