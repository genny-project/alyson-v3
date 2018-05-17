import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import sidebar from '../views/routing/sidebar/sidebar.reducer';
import keycloak from '../views/components/keycloak/keycloak.reducer';
import vertx from '../views/components/vertx/vertx.reducer';

const reducers = combineReducers({
  keycloak,
  sidebar,
  vertx,
  router,
});

export default reducers;
