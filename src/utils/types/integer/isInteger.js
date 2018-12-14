const isInteger = ( integer, options = {}) => {
  const {
    isEqualTo,
    isNotEqualTo,
    isLessThan,
    isGreaterThan,
    isLessThanOrEqualTo,
    isGreaterThanOrEqualTo,
  } = options;

  /* Ensure a valid integer is given. */
  if (
    typeof integer !== 'number' ||
    isNaN( integer )
  ) {
    return false;
  }

  /* Test if integer is equal to given value. */
  if ( isEqualTo != null )
    return integer === isEqualTo;

  /* Test if integer is not equal to given value. */
  if ( isNotEqualTo != null )
    return integer !== isNotEqualTo;

  /* Test if integer is less than or equal to given value. */
  if ( isLessThanOrEqualTo != null ) {
    /* Test if integer is also greater than or equal to given value. */
    if ( isGreaterThanOrEqualTo != null ) {
      return (
        integer <= isLessThanOrEqualTo &&
        integer >= isGreaterThanOrEqualTo
      );
    }

    /* Test if integer is also greater than given value. */
    if ( isGreaterThan != null ) {
      return (
        integer <= isLessThanOrEqualTo &&
        integer > isGreaterThan
      );
    }

    return integer <= isLessThanOrEqualTo;
  }

  /* Test if integer is less than given value. */
  if ( isLessThan != null ) {
    /* Test if integer is also greater than or equal to given value. */
    if ( isGreaterThanOrEqualTo != null ) {
      return (
        integer < isLessThan &&
        integer >= isGreaterThanOrEqualTo
      );
    }

    /* Test if integer is also greater than given value. */
    if ( isGreaterThan != null ) {
      return (
        integer < isLessThan &&
        integer > isGreaterThan
      );
    }

    return integer < isLessThan;
  }

  /* Test if integer is greater than or equal to given value. */
  if ( isGreaterThanOrEqualTo != null )
    return integer >= isGreaterThanOrEqualTo;

  /* Test if integer is greater than given value. */
  if ( isGreaterThan != null )
    return integer > isGreaterThan;

  /* If the integer is valid and no options were passed, return as valid. */
  return true;
};

export default isInteger;
