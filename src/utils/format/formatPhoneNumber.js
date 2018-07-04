const formatPhoneNumber = ( number, options = {}) => {
  const {
    mobile,
    landline,
  } = options;

  if (
    number == null ||
    typeof number !== 'string' ||
    number.length === 0
  ) {
    return 'Invalid phone number';
  }

  if ( mobile ) {
    if ( number.length !== 10 )
      return 'Invalid mobile number';

    const onlyNumbers = number.replace( /\D/g, '' );
    const first = onlyNumbers.slice( 0, 4 );
    const second = onlyNumbers.slice( 4, 7 );
    const third = onlyNumbers.slice( 7, 10 );

    return `${first} ${second} ${third}`;
  }

  if ( landline ) {
    const first = number.slice( 0, 4 );
    const second = number.slice( 4 );

    return `${first} ${second}`;
  }

  return number;
} ;

export default formatPhoneNumber;
