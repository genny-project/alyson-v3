import { NavigationActions } from 'react-navigation';

const middleware = store => next => action => {
  /* Since we are not making any side effects to `action`, pass on next. */
  next( action );

  if ( action.type === 'SIDEBAR_CLOSE' ) {
    store.dispatch(
      NavigationActions.navigate({
        routeName: 'DrawerClose',
      })
    );
  }
};

export default middleware;
