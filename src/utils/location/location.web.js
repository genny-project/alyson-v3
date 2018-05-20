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

export default {
  getBasePath,
};
