const formatCurrency = ( currency, format, options = {}) => { // eslint-disable-line no-unused-vars
  // const {} = options;

  if ( currency == null ) return 'Invalid currency';
  if ( format == null ) return currency;

  return currency;
} ;

export default formatCurrency;
