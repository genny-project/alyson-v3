/* eslint-disable prefer-const */
const getValidRedirectUri = ( options = {}) => {
  let {
    excludeSearch = false,
    excludePathname = false,
  } = options;

  const baseUrl = `${location.protocol}//${location.host}`;

  if (
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/logout'
  ) {
    excludePathname = true;
  }

  if ( excludeSearch ) {
    if ( excludePathname ) {
      return baseUrl;
    }

    return `${baseUrl}${location.pathname}`;
  }

  if ( excludePathname )
    return `${baseUrl}${location.search}`;

  return `${baseUrl}${location.pathname}${location.search}`;
};

export default getValidRedirectUri;
