import { NavigationActions } from 'react-navigation';
import { routes } from '../../config';

const navigator = {
  __appNavigator: null,
  __authNavigator: null,
  __mainNavigator: null,

  setTopLevelAppNavigator: ref => {
    navigator.__appNavigator = ref;
  },

  setTopLevelAuthNavigator: ref => {
    navigator.__authNavigator = ref;
  },

  setMainNavigator: ref => {
    navigator.__mainNavigator = ref;
  },

  listeners: {
    __appNavigator: {},
    __authNavigator: {},
    __mainNavigator: {},
  },

  /* FIXME: listener never fires a callback */
  addListener: ({ useAuthNavigator, on, callback, useMainNavigator }) => {
    const navigatorType = (
      useAuthNavigator ? '__authNavigator'
      : useMainNavigator ? '__mainNavigator'
      : '__appNavigator'
    );

    if ( !navigator[navigatorType] )
      return false;

    navigator.listeners[navigatorType][on] =
      navigator[navigatorType]._navigation.addListener( on, callback );

    return navigator.listeners[navigatorType][on];
  },

  removeListener: ({ useAuthNavigator, listener, useMainNavigator }) => {
    const navigatorType = (
      useAuthNavigator ? '__authNavigator'
      : useMainNavigator ? '__mainNavigator'
      : '__appNavigator'
    );

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

  getMainNavigator: () => {
    return navigator.__mainNavigator;
  },

  goBack: ( options = {}) => {
    const { key, useAuthNavigator, useMainNavigator } = options;

    const navigatorType = (
      useAuthNavigator ? '__authNavigator'
      : useMainNavigator ? '__mainNavigator'
      : '__appNavigator'
    );

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
    useMainNavigator,
  }) => {
    const navigatorType = (
      useAuthNavigator ? '__authNavigator'
      : useMainNavigator ? '__mainNavigator'
      : '__appNavigator'
    );

    if ( !navigator[navigatorType] )
      return defaultValue;

    return navigator[navigatorType]._navigation.getParam( param, defaultValue );
  },

  setParams: ({
    params,
    key,
    useAuthNavigator,
    useMainNavigator,
  }) => {
    const navigatorType = (
      useAuthNavigator ? '__authNavigator'
      : useMainNavigator ? '__mainNavigator'
      : '__appNavigator'
    );

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
    useMainNavigator,
  }) => {
    const navigatorType = (
      useAuthNavigator ? '__authNavigator'
      : useMainNavigator ? '__mainNavigator'
      : '__appNavigator'
    );

    if ( !navigator[navigatorType] )
      return;

    navigator[navigatorType].dispatch(
      NavigationActions.navigate({
        type: NavigationActions.NAVIGATE,
        routeName: (
          navigatorType === '__appNavigator' &&
          !routes[routeName]
        )
          ? 'generic'
          : routeName,
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
