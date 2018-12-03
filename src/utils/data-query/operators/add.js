import { injectContext } from './helpers';
import { isArray } from '../..';

/* Returns the length of the data provided */
export default ( data, options, allData, context ) => {
  const { values } = options;

  if ( !isArray( values )) return null;

  const contextedValues = values.map( value => injectContext( value, {
    ...data,
    ...allData,
    ...context,
  }));

  const result = contextedValues.reduce(( a, b ) => {
    if ( typeof a !== 'number' && typeof b !== 'number' ) return 0;
    if ( typeof a !== 'number' ) return b;
    if ( typeof b !== 'number' ) return a;

    return a + b;
  }, 0 );

  return options.as ? { ...data, [options.as]: result } : result;
};
