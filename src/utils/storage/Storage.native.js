import { AsyncStorage } from 'react-native';

class Storage {
  get = key => {
    return new Promise(( resolve, reject ) => {
      if ( key == null )
        return reject( 'Argument passed to `Storage.get( key )` is either `null` or `undefined`.' );

      AsyncStorage
        .getItem( key )
        .then( resolve )
        .catch( reject );
    });
  }

  set = ( key, value ) => {
    return new Promise(( resolve, reject ) => {
      if ( key == null )
        return reject( 'Argument 0 passed to `Storage.set( key, value )` is either `null` or `undefined`.' );

      AsyncStorage
        .setItem( key, value )
        .then( resolve )
        .catch( reject );
    });
  }

  remove = key => {
    return new Promise(( resolve, reject ) => {
      if ( key == null )
        return reject( 'Argument passed to `Storage.remove( key )` is either `null` or `undefined`.' );

      AsyncStorage
        .removeItem( key )
        .then( resolve )
        .catch( reject );
    });
  }

  getAndParse = key => {
    return new Promise( async ( resolve, reject ) => {
      if ( key == null )
        return reject( 'Argument passed to `Storage.getAndParse( key )` is either `null` or `undefined`.' );

      try {
        const item = await AsyncStorage.getItem( key );
        const parsed = JSON.parse( item );

        resolve( parsed );
      }
      catch ( error ) {
        reject( error );
      }
    });
  }

  stringifyAndSet = ( key, value ) => {
    return new Promise(( resolve, reject ) => {
      if ( key == null )
        return reject( 'Argument 0 passed to `Storage.stringifyAndSet( key, value )` is either `null` or `undefined`.' );

      const stringifiedValue = JSON.stringify( value );

      AsyncStorage
        .setItem( key, stringifiedValue )
        .then( resolve )
        .catch( reject );
    });
  }
}

export default new Storage();
