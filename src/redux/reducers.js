import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import sidebar from '../views/routing/sidebar/sidebar.reducer';
import keycloak from '../views/components/keycloak/keycloak.reducer';
import vertx from '../views/components/vertx/vertx.reducer';
import layout from '../views/layout/layout.reducer';
import navigation from '../views/routing/navigation.reducer';
import theme from '../views/components/theme/theme.reducer';
import dialog from '../views/components/dialog/dialog.reducer';

const reducers = combineReducers({
  keycloak,
  sidebar,
  vertx,
  router,
  layout,
  navigation,
  theme,
  dialog,
});

export default reducers;
