import { isArray, isString  } from '../';

const isObject = ( object, options = {}) => {
  const {
    withProperties, // array
    withProperty, // string
  } = options;

  /* Ensure a valid object (and not an array - thanks JS!) is given. */
  if (
    object == null ||
    typeof object !== 'object' ||
    object instanceof Array
  ) {
    return false;
  }

  /* If withProperties is given, loop through the array and ensure
  * each property is a string and exists in the object. */
  if ( isArray( withProperties )) {
    for ( let i = 0; i < withProperties.length; i++ ) {
      const property = withProperties[i];

      if (
        isString( property ) &&
        !object.hasOwnProperty( property )
      ) {
        return false;
      }
    }
  }

  /* If withProperty is given, ensure it exists inside the object. */
  if ( isString( withProperty )) {
    if ( !object.hasOwnProperty( withProperty )) {
      return false;
    }
  }

  return true;
};

export default isObject;
