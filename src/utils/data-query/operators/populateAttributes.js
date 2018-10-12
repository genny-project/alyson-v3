import dlv from 'dlv';
import dset from 'dset';
import { isArray } from '../../../utils';
import { injectContext } from './helpers';

export default ( data, options, allData ) => {
  if ( !data ) {
    return data;
  }

  const { code, fields, path, single, as, context } = options;

  if ( code ) {
    if ( isArray( data )) {
      return data.map( item => {
        if ( !item ) {
          return item;
        }

        const dataPool = { ...item, ...context };
        const injectedCode = injectContext( code, dataPool );
        const injectedAs = injectContext( as, dataPool );

        dset( item, injectedAs, allData.baseEntities.attributes[injectedCode] );

        return item;
      });
    }

    const dataPool = { ...data, ...context };
    const injectedCode = injectContext( code, dataPool );
    const injectedAs = injectContext( as, dataPool );

    dset( data, injectedAs, allData.baseEntities.attributes[injectedCode] );

    return data;
  }

  if ( path ) {
    return [
      ...data.map( item => {
        const pathData = dlv( item, path );
        const result = { ...pathData };

        if ( !pathData ) {
          return item;
        }

        if ( single ) {
          result['attributes'] = result.code ? allData.baseEntities.attributes[result.code] : {};
        } else {
          if ( typeof pathData !== 'object' ) {
            return item;
          }

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

  return [
    ...data.map( item => {
      const result = { ...item };

      result['attributes'] = result.code ? allData.baseEntities.attributes[result.code] : {};

      return result;
    }),
  ];
};
