class Storage {
  get = key => {
    return new Promise(( resolve, reject ) => {
      if ( key == null )
        return reject( 'Argument passed to `Storage.get( key )` is either `null` or `undefined`.' );

      try {
        const item = localStorage.getItem( key );

        resolve( item );
      }
      catch ( error ) {
        reject( error );
      }
    });
  }

  set = ( key, value ) => {
    return new Promise(( resolve, reject ) => {
      if ( key == null )
        return reject( 'Argument 0 passed to `Storage.set( key, value )` is either `null` or `undefined`.' );

      try {
        localStorage.setItem( key, value );
        resolve();
      }
      catch ( error ) {
        reject( error );
      }
    });
  }

  remove = key => {
    return new Promise(( resolve, reject ) => {
      if ( key == null )
        return reject( 'Argument passed to `Storage.remove( key )` is either `null` or `undefined`.' );

      try {
        localStorage.removeItem( key );
        resolve();
      }
      catch ( error ) {
        reject( error );
      }
    });
  }

  getAndParse = async key => {
    return new Promise(( resolve, reject ) => {
      if ( key == null )
        return reject( 'Argument passed to `Storage.getAndParse( key )` is either `null` or `undefined`.' );

      try {
        const item = localStorage.getItem( key );
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

      try {
        const item = localStorage.setItem( key, stringifiedValue );

        resolve( item );
      }
      catch ( error ) {
        reject( error );
      }
    });
  }
}

export default new Storage();
