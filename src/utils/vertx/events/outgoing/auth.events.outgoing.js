export const AUTH_INIT = token => ({
  event_type: 'AUTH_INIT',
  msg_type: 'EVT_MSG',
  token,
  data: {
    code: 'AUTH_INIT',
  },
});

export const REDIRECT_RETURN = token => ({
  event_type: 'REDIRECT_RETURN',
  msg_type: 'EVT_MSG',
  token,
  data: {
    code: 'REDIRECT_RETURN',
  },
});

export const SEND_CODE = ( event, data, token ) => ({
  event_type: event,
  msg_type: 'EVT_MSG',
  token: token,
  data: data,
});

export const LOGOUT = ( event, data, token ) => ({
  event_type: event,
  msg_type: 'EVT_MSG',
  token: token,
  data: data,
});

export const ACCOUNTS = ( event, data, token ) => ({
  event_type: event,
  msg_type: 'EVT_MSG',
  token: token,
  data: data,
});
