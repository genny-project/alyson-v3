import { isArray } from '../../../../utils';

export default ( input, value, doesValueMatch ) => {
  if ( !isArray( value ))
    return false;

  return value.filter( operators => doesValueMatch( operators )).length === 0;
};
