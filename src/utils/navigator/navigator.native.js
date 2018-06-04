import { NavigationActions } from 'react-navigation';
import { routes } from '../../config';

const navigator = {
  __appNavigator: null,

  setTopLevelAppNavigator: ref => {
    navigator.__appNavigator = ref;
  },

  setTopLevelAuthNavigator: ref => {
    navigator.__authNavigator = ref;
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
