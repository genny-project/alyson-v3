export default {
  app: {
    name: 'Genny',
  },
  genny: {
    // host: 'https://bridge-v3.channel40.com.au',
    host: 'http://bridge-channel40-staging.outcome-hub.com',
    bridge: {
      // port: '8088',
      port: '80',
      endpoints: {
        vertex: 'frontend',
        service: 'api/service',
        events: 'api/events',
      },
    },
  },
  google: {
    maps: {
      apiUrl: 'https://maps.googleapis.com/maps/api/js',
    },
  },
};
