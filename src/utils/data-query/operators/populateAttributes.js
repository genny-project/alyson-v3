import dlv from 'dlv';
import dset from 'dset';

export default ( data, options, allData ) => {
  if ( !data ) {
    return data;
  }

  const { fields, path, single } = options;

  if ( path ) {
    return [
      ...data.map( item => {
        const pathData = dlv( item, path );
        const result = { ...pathData };

        if ( single ) {
          result['attributes'] = result.code ? allData.baseEntities.attributes[result.code] : {};
        } else {
          Object.keys( pathData ).forEach( field => {
            const begCode = field && pathData[field] ? pathData[field].code : null;

            result[field] = {
              ...result[field],
              attributes: begCode ? allData.baseEntities.attributes[begCode] : {},
            };
          });
        }

        dset( item, path, result );

        return item;
      }),
    ];
  }

  if ( fields ) {
    return [
      ...data.map( item => ({
        ...item,
        ...( fields.reduce(( output, field ) => {
          const begCode = dlv( item, field ) ? dlv( item, field ).code : null;

          return {
            ...output,
            [field]: {
              ...dlv( item, field ),
              attributes: begCode ? allData.baseEntities.attributes[begCode] : {},
            } };
        }, item )),
      })),
    ];
  }
};
