import store from '../../redux/store';

const vertxStore = store && store.getState().vertx;

export const getAlias = alias => {
  return vertxStore.aliases[alias];
};

export const getProjectAlias = () => {
  return getAlias( 'PROJECT' );
};

export const getUserAlias = () => {
  return getAlias( 'USER' );
};

export const getUserCompanyAlias = () => {
  return getAlias( 'USER_COMPANY' );
};
