import { AppStackNavigator } from './AppStack';

const initialState = AppStackNavigator.router.getStateForAction(
  AppStackNavigator.router.getActionForPathAndParams( 'generic', { layout: 'home' })
);

export const reducer = ( state = initialState, action ) => {
  if ( action.type === 'USER_LOGOUT' ) {
    return { ...initialState };
  }

  const nextState = AppStackNavigator.router.getStateForAction( action, state );

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};

export default reducer;
