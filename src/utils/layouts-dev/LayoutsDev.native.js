
import axios from 'axios';
import { NavigationActions } from 'react-navigation';
import { store } from '../../redux';
import { routes } from '../../config';
import { loadDevLayouts, clearAllLayouts, loadDevLayout } from '../../redux/actions';

class LayoutsDev {
  constructor() {
    this.realm = null;
  }

  async load( realm ) {
    this.realm = realm;

    try {
      /* Read the dev routes from the layout cache for this realm */
      const success = await axios({
        method: 'get',
        url: `http://localhost:2223/${realm}/routing.dev.json`,
      });

      this.processRoutes( realm, success.data );
    }
    catch ( error ) {
      console.error( 'ERROR', `http://localhost:2223/${realm}/routing.dev.json`, error );
    }

    store.dispatch(
      loadDevLayouts( realm )
    );
  }

  async getLayoutData( realm, path, callback ) {
    try {
      const success = await axios({
        method: 'get',
        url: `http://localhost:2223/${realm}/${path}`,
      });

      callback( success.data );
    }
    catch ( error ) {
      console.error( 'ERROR', `http://localhost:2223/${realm}/routing.dev.json`, error );
    }
  }

  navigate( path ) {
    store.dispatch(
      NavigationActions.navigate({
        routeName: routes[path] ? path : 'generic',
        params: {
          layout: path,
        },
      }),
    );
  }

  reload( path ) {
    this.load( this.realm );
    this.navigate( '/tmp' );

    setTimeout(() => {
      this.navigate( path );
    }, 500 );
  }

  processRoutes( realm, routes ) {
    /* Firstly clear out any existing layouts */
    store.dispatch( clearAllLayouts());

    routes.forEach( route => {
      const code = `LAY_${realm.toUpperCase()}_${route.path.split( '/' ).join( '-' ).toUpperCase()}`;

      this.getLayoutData( realm, route.path, data => {
        const attribute = {
          [code]: {
            PRI_LAYOUT_DATA: {
              attributeCode: 'PRI_LAYOUT_DATA',
              baseEntityCode: code,
              created: new Date().toString(),
              updated: new Date().toString(),
              value: JSON.stringify( data ),
              valueString: JSON.stringify( data ),
              weight: 0,
            },
            PRI_LAYOUT_MODIFIED_DATE: {
              attributeCode: 'PRI_LAYOUT_MODIFIED_DATE',
              baseEntityCode: code,
              created: new Date().toString(),
              updated: new Date().toString(),
              value: JSON.stringify( data ),
              valueString: JSON.stringify( data ),
              weight: 0,
            },
            PRI_LAYOUT_NAME: {
              attributeCode: 'PRI_LAYOUT_NAME',
              baseEntityCode: code,
              created: new Date().toString(),
              updated: new Date().toString(),
              value: route.name,
              valueString: route.name,
              weight: 0,
            },
            PRI_LAYOUT_URI: {
              attributeCode: 'PRI_LAYOUT_URI',
              baseEntityCode: code,
              created: new Date().toString(),
              updated: new Date().toString(),
              value: route.uri,
              valueString: route.uri,
              weight: 0,
            },
          },
        };

        store.dispatch(
          loadDevLayout( attribute )
        );
      });
    });
  }
}

global.LayoutsDev = new LayoutsDev();
