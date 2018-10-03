export default ( input, value, doesValueMatch ) => {
  return !!value.find( operators => doesValueMatch( operators ));
};
