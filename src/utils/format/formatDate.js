import moment from 'moment';

const formatDate = ( date, format, options = {}) => { // eslint-disable-line no-unused-vars
  // const {} = options;

  if ( date == null ) return 'Invalid date';
  if ( format == null ) return date;

  return moment( date ).format( format );
} ;

export default formatDate;
