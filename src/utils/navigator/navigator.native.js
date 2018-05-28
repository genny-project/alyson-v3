import { NavigationActions } from 'react-navigation';

const navigator = {};

navigator.setTopLevelNavigator = ref => {
  navigator.__navigator = ref;
};

navigator.navigate = ( routeName, params = {}) => {
  if ( !navigator.__navigator )
    return;

  navigator.__navigator.dispatch(
    NavigationActions.navigate({
      type: NavigationActions.NAVIGATE,
      routeName: 'generic',
      params: {
        ...params,
        layout: routeName,
      },
    })
  );
};

export default navigator;
