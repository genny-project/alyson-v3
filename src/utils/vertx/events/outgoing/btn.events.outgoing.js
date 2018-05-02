export const BTN = ( event_type, data, token ) => ({
  event_type : event_type,
  msg_type: 'EVT_MSG',
  data: data,
  token: token,
});
