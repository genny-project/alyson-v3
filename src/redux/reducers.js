import { combineReducers } from 'redux';
import sidebar from '../views/routing/sidebar/sidebar.reducer';

const reducer = combineReducers({
  sidebar,
});

export default reducer;
