export const ANSWER = ( data, items, token ) => ({
  data_type: data,
  msg_type: 'DATA_MSG',
  token: token,
  items: items,
});
