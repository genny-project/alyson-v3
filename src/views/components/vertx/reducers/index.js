import { combineReducers } from 'redux';
import baseEntities from './baseEntities.reducer';
import asks from './asks.reducer';
import connection from './connection.reducer';
import aliases from './aliases.reducer';
import user from './user.reducer';

const reducer = combineReducers({
  baseEntities,
  asks,
  connection,
  aliases,
  user,
});

export default reducer;
