export default {
  app: {
    name: 'Genny',
  },
  genny: {
    host: 'https://bridge-eet-dev.outcome-hub.com',
    initUrl: 'https://eet-dev.outcome-hub.com',
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
    apiKey: 'AIzaSyC5HjeRqeoqbxHEQWieE0g9hLaN6snjorA',
    maps: {
      apiUrl: 'https://maps.googleapis.com/maps/api/js',
    },
  },
  uppy: {
    url: 'https://uppych40.channel40.com.au/s3/',
  },
  keycloak: {
    redirectUri: 'https://d2oki2ya5fhih0.cloudfront.net',
  },
  layouts: {
    publicURL: 'http://10.1.120.225:2224/',
    query: {
      url: 'layouts/eet-new',
    },
  },
};
