import moment from 'moment';

const formatDate = ( date, format, options = {}) => { // eslint-disable-line no-unused-vars
  // const {} = options;

  return moment( date ).format( format );
} ;

export default formatDate;
