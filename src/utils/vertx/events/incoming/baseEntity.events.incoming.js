// import { BASE_ENTITY as BASE_ENTITY_MESSAGE } from 'constants';
// import { BASE_ENTITY_DATA as DATA} from 'constants';
// import { EVT_LINK_CHANGE as BASE_ENTITY_LINK_CHANGE} from 'constants';

export const BaseEntity = message => ({
  type: 'BASE_ENTITY_MESSAGE',
  payload: message,
});

export const Data = message => ({
  type: 'DATA',
  payload: message,
});

export const EVT_LINK_CHANGE = message => ({
  type: 'BASE_ENTITY_LINK_CHANGE',
  payload: message,
});
