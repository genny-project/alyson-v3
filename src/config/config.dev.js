export default {
  app: {
    name: 'Genny',
  },
  genny: {
    // host: 'https://bridge-v3.channel40.com.au',
    host: 'https://bridge-channel40-staging.outcome-hub.com',
    // host: 'http://bridge.genny.life',
    // host: 'http://localhost:8088',
    bridge: {
      port: '8088',
      // port: '80',
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
