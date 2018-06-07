export default {
  app: {
    name: 'Genny',
  },
  genny: {
    host: 'https://bridge-v3.channel40.com.au',
    initUrl: 'https://v2.channel40.com.au',
    bridge: {
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
  uppy: {
    url: 'https://uppych40.channel40.com.au/s3/',
  },
};
