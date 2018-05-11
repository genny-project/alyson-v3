import dlv from 'dlv';
import dset from 'dset';

export default ( data, options, allData ) => {
  if ( !data ) {
    return data;
  }
  
  return data.map( item => {
    const links = ( options.field ? dlv( item, options.field ) : item ).links;
    links.forEach( link => {
      const beg = allData.baseEntities.data[ link.link.targetCode ];
      if ( options.as ) {
        dset( item, `${options.as}.${link.link.linkValue}`, beg );
        return;
      }

      item[ link.link.linkValue ] = beg;
    });

    return item;
  });
};
