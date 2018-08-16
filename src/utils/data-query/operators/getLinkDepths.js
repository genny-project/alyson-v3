import dset from 'dset';
import '.';

export default ( data, options, allData ) => {
  if ( !data ) {
    return data;
  }

  if ( !options ) {
    return data;
  }

  const { code, as } = options;

  if ( !code ) {
    return data;
  }

  /* Create an object to store the result */
  let result = {};

  /* Get the root level beg */
  const beg = allData.baseEntities.data[code];

  /* Store the root beg as depth 0 */
  result[beg.code] = 0;

  /* Calculate the depth of all the children */
  result = getChildrenLinks( beg, 0, {
    [beg.code]: 0,
  }, allData );

  dset( data, as, result );

  return data;
};

function getChildrenLinks( beg, depth, existing, allData ) {
  const links = beg.links;

  links.forEach(({ link }) => {
    if ( !existing[link.targetCode] ) {
      existing[link.targetCode] = depth + 1;

      /* Get the link for the linked entity */
      const linkedBeg = allData.baseEntities.data[link.targetCode];

      if ( linkedBeg ) {
        getChildrenLinks( linkedBeg, depth + 1, existing, allData );
      }
    }
  });

  return existing;
}
