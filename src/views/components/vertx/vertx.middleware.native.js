import { NavigationActions } from 'react-navigation';
import { routes } from '../../../config';
import * as actions from './vertx.actions';
import { Bridge, removeStartingAndEndingSlashes } from '../../../utils';
import { alert } from '../../components';

const middleware = store => next => action => {
  /* Since we are not making any side effects to `action`, pass on next. */
  next( action );

  if ( action.type === 'AUTH_ATTEMPT_SUCCESS' ) {
    store.dispatch(
      actions.initVertx()
    );
  }

  if ( action.type === 'VERTX_INIT_ATTEMPT' ) {
    const { data, accessToken } = store.getState().keycloak;

    Bridge.initVertx( data.vertx_url, accessToken );
  }

  if ( action.type === 'VERTX_INIT_SUCCESS' ) {
    const { accessToken } = store.getState().keycloak;

    Bridge.sendAuthInit( accessToken );
  }

  if ( action.type === 'ROUTE_CHANGE' ) {
    const code = removeStartingAndEndingSlashes( action.payload.code );
    const { navigation } = store.getState();
    const { params, routeName } = navigation.routes[navigation.index];
    const currentRoute = ( params && params.layout ) || routeName;

    /* Stop route change from pushing the same route as the current route. */
    if ( code !== currentRoute ) {
      store.dispatch(
        NavigationActions.navigate({
          routeName: routes[code] ? code : 'generic',
          params: {
            layout: code,
          },
        })
      );
    }
  }

  if ( action.type === 'ROUTE_BACK' ) {
    store.dispatch(
      NavigationActions.back()
    );
  }

  if ( action.type === 'NOTIFICATION_MESSAGE' ) {
    const { style, message } = action.payload;

    const title = style === 'warning'
      ? 'Warning!'
      : 'Notification';

    alert({ title, message });
  }
};

export default middleware;
