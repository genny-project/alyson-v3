import { injectContext } from './helpers';
import { isArray, isInteger } from '../..';

/* Returns the length of the data provided */
export default ( data, options, allData, context ) => {
  const { values } = options;

  if ( !isArray( values )) return null;

  const contextedValues = values.map( value =>  injectContext( value, {
    ...data,
    ...allData,
    ...context,
  }));

  const result = contextedValues.reduce(( a, b ) => {
    const convertToInteger = ( item ) => {
      return typeof item === 'number' ? item : parseInt( item, 10 );
    };

    const intA = convertToInteger( a );
    const intB = convertToInteger( b );

    if ( !isInteger( intA ) && !isInteger( intB )) return 0;
    if ( !isInteger( intA )) return intB;
    if ( !isInteger( intB )) return intA;

    return intA + intB;
  }, 0 );

  return options.as ? { ...data, [options.as]: result } : result;
};
