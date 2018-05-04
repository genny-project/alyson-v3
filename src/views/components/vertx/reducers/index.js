import { combineReducers } from 'redux';
import baseEntities from './baseEntities.reducer';
import asks from './asks.reducer';
import connection from './connection.reducer';
import aliases from './aliases.reducer';

const reducer = combineReducers({
  baseEntities,
  asks,
  connection,
  aliases,
});

export default reducer;
