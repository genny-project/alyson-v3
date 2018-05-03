const prefixedLog = ( prefix, options = {}) => {
  const {
    defaultLevel = 'info',
  } = options;

  return ( message, level = defaultLevel ) => {
    const string = `[${prefix}] ${message}`;

    console[level].call( console, string ); // eslint-disable-line no-console
  };
};

export default prefixedLog;
