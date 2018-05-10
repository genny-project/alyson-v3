export default ( input, value ) => {
  return !!( `${input}`.match( value ));
};
