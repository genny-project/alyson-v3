import dlv from 'dlv';
import dset from 'dset';

export default ( data, options, allData ) => {
  if ( !data ) {
    return data;
  }

  const input = data.length ? data : [data];

  input.map( item => {
    const data = options.field
      ? dlv( item, options.field )
      : item;

    if ( !data || !data.links ) {
      return item;
    }

    const { links } = data;
    const multipleArray = [];

    links.forEach( link => {
      const beg = link.link && allData.baseEntities.data[link.link.targetCode];

      if ( !beg ) {
        return;
      }

      beg.linkValue = link.link.linkValue;

      if ( options.as ) {
        if ( options.multiple ) {
          multipleArray.push( beg );

          return;
        }

        dset( item, `${options.as}.${link.link.linkValue}`, beg );

        return;
      }

      item[link.link.linkValue] = beg;
    });

    if ( options.as && options.multiple ) {
      dset( item, options.as, multipleArray );
    }

    return item;
  });

  return data.length ? input : input[0];
};
