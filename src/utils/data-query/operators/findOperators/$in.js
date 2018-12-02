import { isArray } from '../../../../utils';

export default ( input, value ) => {
  if ( !isArray( input ))
    return false;

  return input.includes( value );
};
