import dlv from 'dlv';

export default ( data, options ) => {
  /* Get the field we are using to compare on */
  const { field } = options;
  const output = {};

  data.forEach( item => {
    const comparisonField = dlv( item, field );

    if ( !output[comparisonField] ) {
      output[comparisonField] = item;
    }
  });

  return Object.keys( output ).map( key => output[key] );
};
