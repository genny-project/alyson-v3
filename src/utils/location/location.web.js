const getBasePath = () => {
  const { pathname } = window.location;
  const split = pathname.split( '/' );

  if (
    split.length === 0 ||
    split[1] === ''
  ) {
    return 'home';
  }

  return split[1];
};

export default {
  getBasePath,
};
