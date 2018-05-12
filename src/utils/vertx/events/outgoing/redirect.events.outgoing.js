
export const REDIRECT_EVENT = ( redirect_code, data, token ) => ({
  event_type: 'REDIRECT_EVENT',
  msg_type: 'EVT_MSG',
  data: data,
  token: token,
});
