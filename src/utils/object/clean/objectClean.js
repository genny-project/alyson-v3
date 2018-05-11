const handleReduce = object => ( resultant, key ) => {
  if ( object[key] != null )
    resultant[key] = object[key];

  return resultant;
};

const objectClean = object => {
  return Object
    .keys( object )
    .reduce( handleReduce( object ), {});
};

export default objectClean;
