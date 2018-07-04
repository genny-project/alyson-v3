import dlv from 'dlv';
import dset from 'dset';

export default ( data, options, allData ) => {
  if ( !data ) {
    return data;
  }

  const { path, as } = options;

  /* Get the BEG */
  const beg = path ? dlv( data, path ) : data;

  if ( !beg ) {
    return data;
  }

  /* Get the attributes for the BEG */
  const attributes = allData.baseEntities.attributes[beg.code];

  dset( data, as, attributes );

  return data;
};
