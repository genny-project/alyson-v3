import moment from 'moment';

const formatDate = ( date, format, options = {}) => {
  if ( date == null ) return 'Invalid date';
  if ( format == null ) return date;

  const {
    referenceTime,
    config,
  } = options;

  if ( format === 'calendar' )
    return moment( date ).calendar( referenceTime, config );

  return moment( date ).format( format );
} ;

export default formatDate;
