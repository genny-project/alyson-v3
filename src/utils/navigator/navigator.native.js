import { NavigationActions } from 'react-navigation';

const navigator = {};

navigator.setTopLevelNavigator = ref => {
  navigator.__navigator = ref;
};

navigator.navigate = ( routeName, params ) => {
  navigator.__navigator.dispatch(
    NavigationActions.navigate({
      type: NavigationActions.NAVIGATE,
      routeName,
      params,
    })
  );
};

export default navigator;
