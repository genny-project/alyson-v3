import { isArray } from '../../../../utils';

export default ( input, value ) => {
  if ( !isArray( value ))
    return false;

  return value.includes( input );
};
