import { NavigationActions } from 'react-navigation';
import { routes } from '../../config';

const navigator = {
  __appNavigator: null,
  __authNavigator: null,

  setTopLevelAppNavigator: ref => {
    navigator.__appNavigator = ref;
  },

  setTopLevelAuthNavigator: ref => {
    navigator.__authNavigator = ref;
  },

  listeners: {
    __appNavigator: {},
    __authNavigator: {},
  },

  /* FIXME: listener never fires a callback */
  addListener: ({ useAuthNavigator, on, callback }) => {
    const navigatorType = useAuthNavigator
      ? '__authNavigator'
      : '__appNavigator';

    if ( !navigator[navigatorType] )
      return false;

    navigator.listeners[navigatorType][on] =
      navigator[navigatorType]._navigation.addListener( on, callback );

    return navigator.listeners[navigatorType][on];
  },

  removeListener: ({ useAuthNavigator, listener }) => {
    const navigatorType = useAuthNavigator
      ? '__authNavigator'
      : '__appNavigator';

    if ( !navigator[navigatorType] )
      return false;

    if ( !navigator.listeners[navigatorType][listener] )
      return false;

    navigator.listeners[navigatorType][listener].remove();
    navigator.listeners[navigatorType][listener] = null;

    return true;
  },

  getAppNavigator: () => {
    return navigator.__appNavigator;
  },

  getAuthNavigator: () => {
    return navigator.__authNavigator;
  },

  goBack: ( options = {}) => {
    const { key, useAuthNavigator } = options;

    const navigatorType = useAuthNavigator
      ? '__authNavigator'
      : '__appNavigator';

    if ( !navigator[navigatorType] )
      return;

    navigator[navigatorType].dispatch(
      NavigationActions.back({ key })
    );
  },

  getParam: ({
    param,
    defaultValue,
    useAuthNavigator,
  }) => {
    const navigatorType = useAuthNavigator
      ? '__authNavigator'
      : '__appNavigator';

    if ( !navigator[navigatorType] )
      return defaultValue;

    return navigator[navigatorType]._navigation.getParam( param, defaultValue );
  },

  setParams: ({
    params,
    key,
    useAuthNavigator,
  }) => {
    const navigatorType = useAuthNavigator
      ? '__authNavigator'
      : '__appNavigator';

    navigator[navigatorType].dispatch(
      NavigationActions.setParams({
        params,
        key,
      })
    );
  },

  navigate: ({
    routeName,
    params = {},
    key,
    useAuthNavigator,
  }) => {
    const navigatorType = useAuthNavigator
      ? '__authNavigator'
      : '__appNavigator';

    if ( !navigator[navigatorType] )
      return;

    navigator[navigatorType].dispatch(
      NavigationActions.navigate({
        type: NavigationActions.NAVIGATE,
        routeName: routes[routeName] ? routeName : 'generic',
        params: {
          ...params,
          layout: routeName,
        },
        key: key,
      })
    );
  },
};

export default navigator;
