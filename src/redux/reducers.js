import { combineReducers } from 'redux';
import sidebar from '../views/routing/sidebar/sidebar.reducer';
import keycloak from '../views/components/keycloak/keycloak.reducer';

const reducers = combineReducers({
  keycloak,
  sidebar,
});

export default reducers;
