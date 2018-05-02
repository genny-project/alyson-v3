export const TV_EVENT = ( event, data, token ) => ({
  event_type: event,
  msg_type: 'EVT_MSG',
  token: token,
  data: data,
});
