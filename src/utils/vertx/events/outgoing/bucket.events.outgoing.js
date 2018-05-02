export const BUCKET_DROP_EVENT = ( data, token ) => ({
  event_type: 'EVT_LINK_CHANGE',
  msg_type: 'EVT_MSG',
  token,
  ...data,
});
