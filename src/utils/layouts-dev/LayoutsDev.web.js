import axios from 'axios';
import { push } from 'react-router-redux';
import { store } from '../../redux';
import { loadDevLayouts, clearAllLayouts, loadDevLayout } from '../../redux/actions';

class LayoutsDev {
  constructor() {
    this.realm = null;
  }

  load( realm ) {
    this.realm = realm;

    /* Read the dev routes from the layout cache for this realm */
    axios({
      method: 'get',
      url: `http://localhost:2223/${realm}/routing.dev.json`,
    }).then( success => {
      this.processRoutes( realm, success.data );
    }).catch( error => {
      console.error( error );
    });
    store.dispatch( loadDevLayouts( realm ));
  }

  getLayoutData( realm, path, callback ) {
    axios({
      method: 'get',
      url: `http://localhost:2223/${realm}/${path}`,
    }).then( success => {
      callback( success.data );
    }).catch( error => {
      console.error( error );
    });
  }

  navigate( path ) {
    store.dispatch( push( path ));
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
      const code = `LAY_${realm.toUpperCase()}_${route.name.toUpperCase()}`;

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

        store.dispatch( loadDevLayout( attribute ));
      });
    });
  }
}

global.LayoutsDev = new LayoutsDev();
