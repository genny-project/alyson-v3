import { isArray } from '../../../../utils';

export default ( input, value, doesValueMatch ) => {
  if ( !isArray( value ))
    return false;

  return !!value.find( operators => doesValueMatch( operators ));
};
