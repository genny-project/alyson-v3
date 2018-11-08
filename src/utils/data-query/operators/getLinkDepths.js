import dset from 'dset';
import { isArray } from '../../../utils';
import '.';

export default ( data, options, allData ) => {
  if ( !data ) {
    return data;
  }

  if ( !options ) {
    return data;
  }

  const { code, as, onlyIncludeIf } = options;

  if ( !code ) {
    return data;
  }

  /* Create an object to store the result */
  let result = {};

  /* Get the root level beg */
  const beg = allData.baseEntities.data[code];

  if ( !beg ) {
    return data;
  }

  /* Store the root beg as depth 0 */
  /* Store the root beg as depth 0 */
  // result[beg.code] = 0;

  result = [
    ...result,
    {
      beCode: beg.code,
      value: 0,
    },
  ];

  /* Calculate the depth of all the children */
  result = getChildrenLinks(
    beg,
    0,
    [
      {
        beCode: beg.code,
        value: 0,
      },
    ],
    onlyIncludeIf,
    allData
  );

  dset( data, as, result );

  return data;
};

function getChildrenLinks( beg, depth, existing, onlyIncludeIf, allData ) {
  if ( !beg )
    return existing;

  let links = beg.links;
  const result = existing;

  if (
    isArray( onlyIncludeIf )
  )  {
    links = links.filter( link => {
      return onlyIncludeIf.every( x => {
        return link[x.path] === x.value;
      });
    });
  }

  links.forEach(({ link }) => {
    if (
      result.filter( x => x.beCode === link.targetCode ) < 1 &&
      result.filter( x => x.beCode === link.targetCode && x.value === 0 ) < 1
    ) {
      result.push(
        {
          beCode: link.targetCode,
          value: depth + 1,
        }
      );

      /* Get the link for the linked entity */
      const linkedBeg = allData.baseEntities.data[link.targetCode];

      if ( linkedBeg ) {
        console.log( result );
        getChildrenLinks(
          linkedBeg,
          depth + 1,
          result,
          onlyIncludeIf,
          allData
        );
        console.log( result );
      }
    }
  });

  return result;
}
