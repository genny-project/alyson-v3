export const authInit = token => ({
  event_type: 'AUTH_INIT',
  msg_type: 'EVT_MSG',
  token,
  data: {
    code: 'AUTH_INIT',
  },
});

export const redirectReturn = token => ({
  event_type: 'REDIRECT_RETURN',
  msg_type: 'EVT_MSG',
  token,
  data: {
    code: 'REDIRECT_RETURN',
  },
});

export const sendCode = ( event, data, token ) => ({
  event_type: event,
  msg_type: 'EVT_MSG',
  token: token,
  data: data,
});

export const logout = ( event, data, token ) => ({
  event_type: event,
  msg_type: 'EVT_MSG',
  token: token,
  data: data,
});

export const accounts = ( event, data, token ) => ({
  event_type: event,
  msg_type: 'EVT_MSG',
  token: token,
  data: data,
});
