const getBasePath = () => {
  const { pathname } = window.location;

  if ( pathname === '/' )
    return 'splash';

  if ( pathname.endsWith( '/' ))
    return pathname.substr( 0, pathname.length - 1 );

  return pathname;
};

export default {
  getBasePath,
};
