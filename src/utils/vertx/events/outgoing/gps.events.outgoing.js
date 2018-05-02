export const GPS_DATA = ( items, token ) => ({
  data_type: 'GPS',
  msg_type: 'DATA_MSG',
  token: token,
  items: items,
});
