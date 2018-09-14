import queryString from 'query-string';

const getBasePath = () => {
  const { pathname } = window.location;
  const split = pathname.split( '/' );

  if (
    split.length === 0 ||
    split[1] === ''
  ) {
    return 'home';
  }

  return split.slice( 1 ).join( '/' );
};

const getQueryParams = () => {
  const { search } = window.location;
  const decodedQuery = decodeURIComponent( search );

  return queryString.parse( decodedQuery );
};

const goBack = () => {
  window.history.go( -1 );
};

export default {
  getBasePath,
  getQueryParams,
  goBack,
};
