export default ( input, value ) => {
  console.warn({ input, value, result: input % value[0] === value[1] });

  return input % value[0] === value[1];
};
