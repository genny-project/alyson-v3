export const GEOFENCE_NOTIFICATION = ( event_id, data, token ) => ({
  event_type: event_id,
  msg_type: 'EVT_MSG',
  data: data,
  token: token,
});
