import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import keycloak from '../views/components/keycloak/keycloak.reducer';
import vertx from '../views/components/vertx/vertx.reducer';
import navigation from '../views/routing/navigation.reducer';
import dialog from '../views/components/dialog/dialog.reducer';

const reducers = combineReducers({
  keycloak,
  vertx,
  router,
  navigation,
  dialog,
});

export default reducers;
