import { store } from '../../redux';

const storeQuery = {};

storeQuery.getProjectAlias = () => {
  return store.getState().vertx.aliases.PROJECT;
};

storeQuery.getUserAlias = () => {
  return store.getState().vertx.aliases.USER;
};

storeQuery.getCompanyAlias = () => {
  return store.getState().vertx.aliases.COMPANY;
};

storeQuery.getProjectAttributes = () => {
  const projectAlias = storeQuery.getProjectAlias();

  return store.getState().vertx.baseEntities.attributes[projectAlias];
};

export default storeQuery;
